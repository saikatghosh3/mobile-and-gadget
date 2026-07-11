import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  description: {
    type: String,
    default: '',
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping'],
    required: true,
  },
  discountValue: {
    type: Number,
    default: 0,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxDiscountLimit: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    default: null,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  totalUsageLimit: {
    type: Number,
    default: 0,
  },
  perUserUsageLimit: {
    type: Number,
    default: 1,
  },
  customerEligibility: {
    type: String,
    enum: ['all', 'new', 'vip'],
    default: 'all',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'disabled'],
    default: 'active',
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  totalDiscountGiven: {
    type: Number,
    default: 0,
  },
  totalRevenueGenerated: {
    type: Number,
    default: 0,
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    discountAmount: Number,
    orderTotal: Number,
    usedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

export default async function Coupon() {
  await connectDB();
  return mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
}
