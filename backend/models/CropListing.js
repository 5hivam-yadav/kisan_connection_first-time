import mongoose from 'mongoose';

const cropListingSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String },
  farmerPhone: { type: String },
  farmerRating: { type: Number, default: 4.8 },
  farmerVerified: { type: Boolean, default: true },
  cropName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Vegetables', 'Fruits', 'Grains & Cereals', 'Pulses & Legumes', 'Spices & Condiments', 'Cash Crops', 'Oilseeds'], 
    required: true 
  },
  variety: { type: String, default: 'Desi / Hybrid' },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'Quintal', 'Ton', 'Crates', 'Boxes', 'Dozens'], default: 'Quintal' },
  quality: { type: String, enum: ['Grade A (Premium)', 'Grade B (Standard)', 'Grade C (Commercial)', 'Export Quality', 'Organic Certified'], default: 'Grade A (Premium)' },
  price: { type: Number, required: true }, // Expected price per unit
  harvestDate: { type: Date, default: Date.now },
  availabilityDate: { type: Date, default: Date.now },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, default: '' },
    pincode: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: 20.0 },
      lng: { type: Number, default: 73.8 }
    }
  },
  images: [{ type: String }],
  farmingMethod: { type: String, enum: ['100% Certified Organic', 'Natural / ZBNF', 'Integrated Pest Management', 'Conventional Good Agricultural Practice'], default: '100% Certified Organic' },
  status: { type: String, enum: ['active', 'paused', 'sold_out'], default: 'active' },
  description: { type: String, default: '' },
  packaging: { type: String, default: 'Standard Gunny Bags / Crates' },
  contactPreference: { type: String, enum: ['All (Phone + Chat + Inquiry)', 'Chat & Platform Inquiry Only', 'Phone Only'], default: 'All (Phone + Chat + Inquiry)' },
  viewsCount: { type: Number, default: 0 },
  inquiriesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const CropListing = mongoose.model('CropListing', cropListingSchema);
