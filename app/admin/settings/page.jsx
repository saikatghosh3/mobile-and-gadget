'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/components/SettingsContext';
import ImageUpload from '@/components/ImageUpload';
import { Plus, Trash2, GripVertical, Settings as SettingsIcon, ImageOff } from 'lucide-react';

const PLATFORMS = [
  'facebook', 'instagram', 'whatsapp', 'linkedin',
  'youtube', 'tiktok', 'x-twitter',
];

const PLATFORM_LABELS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  'x-twitter': 'X (Twitter)',
};

export default function AdminSettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [form, setForm] = useState({
    websiteName: '',
    contactPhone: '',
    supportEmail: '',
    businessAddress: '',
    copyrightText: '',
  });
  const [websiteLogo, setWebsiteLogo] = useState('');
  const [favicon, setFavicon] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setForm({
        websiteName: settings.websiteName || '',
        contactPhone: settings.contactPhone || '',
        supportEmail: settings.supportEmail || '',
        businessAddress: settings.businessAddress || '',
        copyrightText: settings.copyrightText || '',
      });
      setWebsiteLogo(settings.websiteLogo || '');
      setFavicon(settings.favicon || '');
      setSocialLinks(settings.socialLinks || []);
    }
  }, [settings]);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAddSocial = () => {
    setSocialLinks((prev) => [...prev, { platform: '', url: '', enabled: true }]);
  };

  const handleRemoveSocial = (index) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSocialChange = (index, field, value) => {
    setSocialLinks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const payload = {
      ...form,
      websiteLogo,
      favicon,
      socialLinks: socialLinks.filter((s) => s.platform && s.url),
    };

    const result = await updateSettings(payload);
    if (result.success) {
      setMessage('Settings saved successfully');
    } else {
      setError(result.error || 'Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Website Settings
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage global website information. Changes apply immediately across the site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{message}</div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        {/* Business Information */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="p-5 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900">Business Information</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Website Name</label>
              <input
                type="text"
                value={form.websiteName}
                onChange={update('websiteName')}
                placeholder="My Store"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Website Logo</label>
              <ImageUpload
                images={websiteLogo ? [websiteLogo] : []}
                onImagesChange={(images) => setWebsiteLogo(images[0] || '')}
                maxImages={1}
              />
              {websiteLogo && (
                <button
                  type="button"
                  onClick={() => setWebsiteLogo('')}
                  className="mt-2 flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <ImageOff className="w-4 h-4" />
                  Remove Logo
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Favicon</label>
              <ImageUpload
                images={favicon ? [favicon] : []}
                onImagesChange={(images) => setFavicon(images[0] || '')}
                maxImages={1}
              />
              {favicon && (
                <button
                  type="button"
                  onClick={() => setFavicon('')}
                  className="mt-2 flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <ImageOff className="w-4 h-4" />
                  Remove Favicon
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Contact Phone</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={update('contactPhone')}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={update('supportEmail')}
                placeholder="support@example.com"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Business Address</label>
              <textarea
                value={form.businessAddress}
                onChange={update('businessAddress')}
                placeholder="123 Tech Street, Silicon Valley, CA"
                rows={2}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Copyright Text</label>
              <input
                type="text"
                value={form.copyrightText}
                onChange={update('copyrightText')}
                placeholder="© 2024 TechGadget. All rights reserved."
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Social Media Links</h2>
            <button
              type="button"
              onClick={handleAddSocial}
              className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          <div className="p-5 space-y-4">
            {socialLinks.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-4">No social links added yet.</p>
            ) : (
              socialLinks.map((link, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">Platform</label>
                      <select
                        value={link.platform}
                        onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      >
                        <option value="">Select platform</option>
                        {PLATFORMS.map((p) => (
                          <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">URL</label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => handleSocialChange(index, 'enabled', e.target.checked)}
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="text-xs font-medium text-neutral-500">Enabled</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
