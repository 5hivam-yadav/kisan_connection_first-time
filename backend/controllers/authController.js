import { dataStore } from '../services/dataStore.js';
import { generateToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'kisanconnect_super_secret_jwt_key_2026';
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const otpStore = new Map();

const normaliseEmail = (email = '') => email.trim().toLowerCase();

const getMailTransport = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_PORT) === '465',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
};

export const sendOtp = async (req, res) => {
  try {
    const email = normaliseEmail(req.body.email);
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'A valid email address is required' });
    }

    if (await dataStore.findUserByEmail(email)) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }

    const transport = getMailTransport();
    if (!transport) {
      return res.status(503).json({
        success: false,
        message: 'Email verification is not configured. Add SMTP settings to backend/.env.'
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    otpStore.set(email, {
      otpHash: crypto.createHash('sha256').update(otp).digest('hex'),
      expiresAt: Date.now() + OTP_EXPIRY_MS,
      attempts: 0
    });

    try {
      await transport.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your KisanConnect verification code',
        text: `Your KisanConnect verification code is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`
      });
    } catch (error) {
      otpStore.delete(email);
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email address'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const email = normaliseEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();
    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'Email and a valid 6-digit code are required' });
    }

    const record = otpStore.get(email);
    if (!record || record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'This verification code has expired. Please request a new one.' });
    }

    record.attempts += 1;
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (record.attempts > MAX_OTP_ATTEMPTS || otpHash !== record.otpHash) {
      if (record.attempts > MAX_OTP_ATTEMPTS) otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }
    otpStore.delete(email);

    const verificationToken = jwt.sign({ purpose: 'registration', email }, JWT_SECRET, { expiresIn: '15m' });

    res.status(200).json({
      success: true,
      message: 'Email verified. You can now create your account.',
      verificationToken
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, phone, email: rawEmail, password, role, language, location, businessName, buyerType, requiredCrops, farmSize, cropsGrown, farmingPractices, verificationToken } = req.body;
    const email = normaliseEmail(rawEmail);

    if (!name || !phone || !email || !password || !verificationToken) {
      return res.status(400).json({ success: false, message: 'Name, phone, email, password and email verification are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    try {
      const verified = jwt.verify(verificationToken, JWT_SECRET);
      if (verified.purpose !== 'registration' || verified.email !== email) throw new Error('Invalid verification token');
    } catch {
      return res.status(403).json({ success: false, message: 'Email verification is missing or has expired. Please verify your email again.' });
    }

    const existingUser = await dataStore.findUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this mobile number already exists' });
    }
    if (await dataStore.findUserByEmail(email)) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await dataStore.createUser({
      name,
      phone,
      email: email || '',
      password: passwordHash,
      role: role || 'farmer',
      language: language || 'en',
      location: location || { state: 'Maharashtra', district: 'Nashik', village: 'Dindori', pincode: '422202' },
      businessName: businessName || '',
      buyerType: buyerType || '',
      requiredCrops: requiredCrops || [],
      farmSize: farmSize || 5,
      cropsGrown: cropsGrown || [],
      farmingPractices: farmingPractices || 'Organic',
      verification: { isVerified: true, status: 'verified', documents: [], verifiedAt: new Date() }
    });

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: `Welcome to KisanConnect, ${newUser.name}!`,
      token,
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be phone or email
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide phone/email and password' });
    }

    let user = await dataStore.findUserByPhone(identifier) || await dataStore.findUserByEmail(identifier);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (user.verification?.isVerified === false) {
      return res.status(403).json({ success: false, message: 'Please verify your email before signing in.' });
    }

    const passwordMatches = user.password?.startsWith('$2')
      ? await bcrypt.compare(password, user.password)
      : user.password === password;
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await dataStore.updateUser(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
