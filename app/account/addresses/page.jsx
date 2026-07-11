'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Home, Briefcase } from 'lucide-react';

const labelIcons = { home: Home, office: Briefcase, other: MapPin };
const labelColors = { home: 'bg-blue-100 text-blue-600', office: 'bg-purple-100 text-purple-600', other: 'bg-green-100 text-green-600' };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: 'home', fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'Bangladesh', isDefault: false,
  });

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/addresses', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setAddresses(data.data);
    } catch (error) { console.error('Error fetching addresses:', error); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ label: 'home', fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'Bangladesh', isDefault: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr) => {
    setFormData({
      label: addr.label || 'other', fullName: addr.fullName, phone: addr.phone,
      street: addr.street, city: addr.city, state: addr.state || '',
      zipCode: addr.zipCode, country: addr.country || 'Bangladesh', isDefault: addr.isDefault || false,
    });
    setEditingId(addr._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingId ? `/api/auth/addresses/${editingId}` : '/api/auth/addresses';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      resetForm();
      fetchAddresses();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/auth/addresses/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchAddresses();
  };

  const handleSetDefault = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/auth/addresses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isDefault: true }),
    });
    fetchAddresses();
  };

  const update = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Addresses</h1>
          <p className="text-neutral-500 mt-1">Manage your shipping addresses.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-sm">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4" />
          <p className="text-neutral-500 text-sm">Loading addresses...</p>
        </div>
      ) : !showForm && addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-sm mb-4">No addresses saved yet</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-sm">Add New Address</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {showForm && (
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm p-5">
              <h3 className="font-semibold text-neutral-900 mb-4">{editingId ? 'Edit Address' : 'New Address'}</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Label</label>
                  <div className="flex gap-2">
                    {['home', 'office', 'other'].map((l) => (
                      <button key={l} type="button" onClick={() => setFormData((p) => ({ ...p, label: l }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${formData.label === l ? 'bg-orange-50 border-orange-300 text-orange-600' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name</label>
                    <input type="text" value={formData.fullName} onChange={update('fullName')} required className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Phone</label>
                    <input type="tel" value={formData.phone} onChange={update('phone')} required className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Street</label>
                  <input type="text" value={formData.street} onChange={update('street')} required className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">City</label>
                    <input type="text" value={formData.city} onChange={update('city')} required className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">State</label>
                    <input type="text" value={formData.state} onChange={update('state')} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">ZIP Code</label>
                    <input type="text" value={formData.zipCode} onChange={update('zipCode')} required className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Country</label>
                  <input type="text" value={formData.country} onChange={update('country')} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={(e) => setFormData((p) => ({ ...p, isDefault: e.target.checked }))} className="rounded border-neutral-300 text-orange-500 focus:ring-orange-500" />
                  <label htmlFor="isDefault" className="text-sm text-neutral-700">Set as default address</label>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-sm">
                    {editingId ? 'Update' : 'Save'}
                  </button>
                  <button type="button" onClick={resetForm} className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 text-sm">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {addresses.map((addr) => {
            const LabelIcon = labelIcons[addr.label] || MapPin;
            const labelColor = labelColors[addr.label] || 'bg-neutral-100 text-neutral-600';
            return (
              <div key={addr._id} className={`bg-white rounded-2xl border shadow-sm p-5 ${addr.isDefault ? 'border-orange-300' : 'border-neutral-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${labelColor} flex items-center justify-center`}>
                      <LabelIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 capitalize">{addr.label}</span>
                    {addr.isDefault && <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">Default</span>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(addr)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-orange-600"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(addr._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-neutral-900">{addr.fullName}</p>
                  <p className="text-neutral-500">{addr.phone}</p>
                  <p className="text-neutral-600">{addr.street}, {addr.city}{addr.state ? `, ${addr.state}` : ''} - {addr.zipCode}</p>
                  <p className="text-neutral-500">{addr.country}</p>
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)} className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-medium">Set as Default</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
