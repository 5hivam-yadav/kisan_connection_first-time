import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisanconnect', {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`ℹ️ MongoDB connection not available (${error.message}). Running in High-Speed In-Memory & Seed Mode with full CRUD capabilities.`);
    return false;
  }
};

export const getDbStatus = () => isMongoConnected;
