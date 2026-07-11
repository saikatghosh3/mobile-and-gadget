'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Settings, Camera, Eye, EyeOff } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const result = await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        profilePicture: profilePicture || undefined,
      });
      if (result.success) {
        setMessage('Profile updated successfully');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordData.newPass.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      const result = await changePassword(passwordData.current, passwordData.newPass);
      if (result.success) {
        setPasswordMessage('Password changed successfully');
        setPasswordData({ current: '', newPass: '', confirm: '' });
      } else {
        setPasswordError(result.error || 'Failed to change password');
      }
    } catch {
      setPasswordError('An error occurred');
    } finally {
      setChangingPassword(false);
    }
  };

  const update = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  const updatePass = (field) => (e) => setPasswordData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your personal information.</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-neutral-500" />
            <h2 className="font-semibold text-neutral-900">Personal Information</h2>
          </div>
        </div>
        <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
          {message && <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{message}</div>}
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Profile Picture</label>
            {profilePicture ? (
              <div className="mb-3 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-orange-200">
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setProfilePicture('')}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ) : null}
            <ImageUpload
              images={[]}
              onImagesChange={(images) => setProfilePicture(images[0] || '')}
              maxImages={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
            <input type="text" value={formData.fullName} onChange={update('fullName')} required className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input type="email" value={formData.email} onChange={update('email')} required className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
            <input type="tel" value={formData.phone} onChange={update('phone')} className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
          </div>

          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 text-sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-neutral-500" />
            <h2 className="font-semibold text-neutral-900">Change Password</h2>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="p-5 space-y-4">
          {passwordMessage && <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{passwordMessage}</div>}
          {passwordError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{passwordError}</div>}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Current Password</label>
            <input type="password" value={passwordData.current} onChange={updatePass('current')} required className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">New Password</label>
            <input type={showPasswords ? 'text' : 'password'} value={passwordData.newPass} onChange={updatePass('newPass')} required className="w-full px-4 py-2.5 pr-11 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
            <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 bottom-2.5 text-neutral-400 hover:text-neutral-600">
              {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm New Password</label>
            <input type={showPasswords ? 'text' : 'password'} value={passwordData.confirm} onChange={updatePass('confirm')} required className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
          </div>

          <button type="submit" disabled={changingPassword} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 text-sm">
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>

          <div className="flex items-center gap-2 mt-2">
            <label className="text-sm text-neutral-600 cursor-pointer flex items-center gap-1.5" onClick={() => setShowPasswords(!showPasswords)}>
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPasswords ? 'Hide' : 'Show'} passwords
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
