import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

const returnSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
  }],
  reason: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

returnSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

export default async function Return() {
  await connectDB();
  return mongoose.models.Return || mongoose.model('Return', returnSchema);
}
