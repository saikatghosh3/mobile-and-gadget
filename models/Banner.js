import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  position: {
    type: String,
    enum: ['above-featured', 'above-top-selling', 'above-new-arrivals'],
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
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

bannerSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

export default async function Banner() {
  await connectDB();
  return mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
}
