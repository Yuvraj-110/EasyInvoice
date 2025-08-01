// server/models/Invoice.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  rate: Number
}, { _id: false });

const billToSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  address: String

}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNo: String,
  billDate: Date,
  dueDate: Date,
  status: String,
  discount: Number,
  tax: Number,
  vat: Number,
  shipping: Number,
  currency: String,
  notes: String,
  template: String,

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },

  billTo: billToSchema,
  items: [itemSchema],

  subtotal: String,
  discountAmount: String,
  taxAmount: String,
  vatAmount: String,
  total: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Protect against duplicate invoiceNo for the same business
invoiceSchema.index({ business: 1, invoiceNo: 1 }, { unique: true });

export default mongoose.model('Invoice', invoiceSchema);
