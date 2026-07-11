import { NextResponse } from 'next/server';
import Settings from '../../../models/Settings';
import { requireAdmin } from '../../../lib/auth';

const defaultSettings = {
  websiteName: 'TechGadget',
  websiteLogo: '',
  favicon: '',
  contactPhone: '',
  supportEmail: '',
  businessAddress: '',
  copyrightText: '',
  socialLinks: [],
};

async function getOrCreateSettings() {
  const SettingsModel = await Settings();
  let settings = await SettingsModel.findOne().lean();
  if (!settings) {
    settings = await SettingsModel.create(defaultSettings);
  }
  return settings;
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

async function putHandler(request) {
  try {
    const body = await request.json();
    const SettingsModel = await Settings();
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = await SettingsModel.create({ ...defaultSettings, ...body });
    } else {
      const updateData = {};
      const allowedFields = ['websiteName', 'websiteLogo', 'favicon', 'contactPhone', 'supportEmail', 'businessAddress', 'copyrightText', 'socialLinks'];
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }
      settings = await SettingsModel.findByIdAndUpdate(
        settings._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(putHandler);
