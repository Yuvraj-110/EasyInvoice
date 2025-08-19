// server/models/Invoice.js
import mongoose from 'mongoose';

// Item schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  quantity: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true }
}, { _id: false });

// Bill-to schema
const billToSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  contact: String,
  address: String
}, { _id: false });

// Main Invoice schema
const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true },
  billDate: { type: Date, required: true },
  dueDate: { type: Date },
  status: { type: String, default: "Unpaid" },

  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },

  currency: { type: String, default: "INR" },
  notes: { type: String },
  template: { type: String, default: "Classic" },

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },

  billTo: { type: billToSchema, required: true },
  items: { type: [itemSchema], required: true },

  subtotal: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  vatAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique invoice number for each business
invoiceSchema.index({ business: 1, invoiceNo: 1 }, { unique: true });

export default mongoose.model('Invoice', invoiceSchema);
