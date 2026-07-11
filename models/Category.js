import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  // null = main category, ObjectId = subcategory (parent is the main category)
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  order: {
    type: Number,
    default: 0,
  },
  showOnHome: {
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

categorySchema.pre('save', function () {
  this.updatedAt = Date.now();
});

// Compound index: slug unique within same parent scope
categorySchema.index({ slug: 1, parent: 1 }, { unique: true });

export default async function Category() {
  await connectDB();
  return mongoose.models.Category || mongoose.model('Category', categorySchema);
}
