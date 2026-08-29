import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDbStatus } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import priceRoutes from './routes/priceRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// MongoDB is required for all application data. Keep the API available enough
// to return a clear error while Atlas reconnects instead of letting requests hang.
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || getDbStatus()) return next();
  return res.status(503).json({
    success: false,
    message: 'Database is temporarily unavailable. Please try again shortly.'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'KisanConnect API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB once (works for both local and Vercel serverless)
connectDB().catch(() => {
  console.error('Initial MongoDB connection failed. Reconnection will be attempted on each request.');
});

// For local development: start the HTTP server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌾 KisanConnect Backend Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
