import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '',
  },
  placement: {
    type: String,
    enum: ['hero', 'sidebar', 'banner', 'popup', 'product-section', 'product-details'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
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

advertisementSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

export default async function Advertisement() {
  await connectDB();
  return mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema);
}
