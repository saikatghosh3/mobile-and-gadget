import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  images: [{
    type: String,
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  brand: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  specifications: {
    type: Map,
    of: String,
  },
  features: [{
    type: String,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isTopSelling: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
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

productSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

productSchema.index({ name: 'text', description: 'text', brand: 'text' }, { weights: { name: 10, brand: 5, description: 1 }, name: 'product_text_search' });

export default async function Product() {
  await connectDB();
  return mongoose.models.Product || mongoose.model('Product', productSchema);
}
