import { dataStore } from '../services/dataStore.js';
import { generateToken } from '../middleware/auth.js';

// OTP Simulation Store
const otpStore = new Map();

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    // Fixed / simulated OTP for easy testing
    const demoOtp = '123456';
    otpStore.set(phone, { otp: demoOtp, expiresAt: Date.now() + 5 * 60 * 1000 });

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to +91 ${phone}`,
      simulatedOtp: demoOtp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const record = otpStore.get(phone);
    if (otp !== '123456' && (!record || record.otp !== otp || record.expiresAt < Date.now())) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Use demo OTP 123456.' });
    }

    // Check if user exists
    let user = dataStore.findUserByPhone(phone);
    if (user) {
      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: 'OTP verified & logged in successfully',
        token,
        user
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Proceed with registration.',
      phoneVerified: true
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, phone, email, password, role, language, location, businessName, buyerType, requiredCrops, farmSize, cropsGrown, farmingPractices } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone and password are required' });
    }

    const existingUser = dataStore.findUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this mobile number already exists' });
    }

    const newUser = dataStore.createUser({
      name,
      phone,
      email: email || '',
      password,
      role: role || 'farmer',
      language: language || 'en',
      location: location || { state: 'Maharashtra', district: 'Nashik', village: 'Dindori', pincode: '422202' },
      businessName: businessName || '',
      buyerType: buyerType || '',
      requiredCrops: requiredCrops || [],
      farmSize: farmSize || 5,
      cropsGrown: cropsGrown || [],
      farmingPractices: farmingPractices || 'Organic',
      verification: { isVerified: true, status: 'verified', documents: ['direct_registration_kyc.pdf'] }
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

    let user = dataStore.findUserByPhone(identifier) || dataStore.findUserByEmail(identifier);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // In demo environment, verify matching password or accept password123
    if (user.password !== password && password !== 'password123' && password !== 'adminpassword123') {
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
    const updated = dataStore.updateUser(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Demo quick-switch user
export const switchDemoRole = async (req, res) => {
  try {
    const { role } = req.body;
    let targetUser;
    if (role === 'farmer') {
      targetUser = dataStore.users.find(u => u._id === 'usr_farmer_01') || dataStore.users.find(u => u.role === 'farmer');
    } else if (role === 'buyer') {
      targetUser = dataStore.users.find(u => u._id === 'usr_buyer_01') || dataStore.users.find(u => u.role === 'buyer');
    } else if (role === 'admin') {
      targetUser = dataStore.users.find(u => u.role === 'admin');
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Demo user not found' });
    }

    const token = generateToken(targetUser);
    res.status(200).json({
      success: true,
      message: `Switched to demo ${targetUser.role.toUpperCase()}: ${targetUser.name}`,
      token,
      user: targetUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
