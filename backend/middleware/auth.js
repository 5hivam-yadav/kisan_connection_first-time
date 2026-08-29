import jwt from 'jsonwebtoken';
import { dataStore } from '../services/dataStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisanconnect_super_secret_jwt_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, phone: user.phone },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dataStore.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
