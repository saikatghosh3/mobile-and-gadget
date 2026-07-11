import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  enabled: { type: Boolean, default: true },
}, { _id: true });

const settingsSchema = new mongoose.Schema({
  websiteName: { type: String, default: 'TechGadget' },
  websiteLogo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  supportEmail: { type: String, default: '' },
  businessAddress: { type: String, default: '' },
  copyrightText: { type: String, default: '' },
  socialLinks: [socialLinkSchema],
}, { timestamps: true });

export default async function Settings() {
  await connectDB();
  return mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
}
