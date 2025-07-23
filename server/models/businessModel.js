// models/businessModel.js

import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  logoUrl: String,
  taxId: String,
  businessType: String,
  address: String,
  phone: String,
  website: String,
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);
