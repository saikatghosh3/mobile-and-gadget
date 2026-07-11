import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ['home', 'office', 'other'],
    default: 'other',
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'Bangladesh' },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked', 'suspended'], default: 'active' },
  profilePicture: { type: String, default: '' },
  addresses: [addressSchema],
  resetPasswordToken: { type: String, default: '' },
  resetPasswordExpires: { type: Date, default: null },
  registrationDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

export default async function User() {
  await connectDB();
  return mongoose.models.User || mongoose.model('User', userSchema);
}
