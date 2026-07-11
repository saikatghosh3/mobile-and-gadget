'use client';

import { useEffect, useState } from 'react';
import { Search, Users, Shield, MoreVertical, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';

const statusStyles = {
  active: 'bg-green-100 text-green-700 border-green-200',
  blocked: 'bg-red-100 text-red-700 border-red-200',
  suspended: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const roleStyles = {
  admin: 'bg-purple-100 text-purple-700',
  user: 'bg-blue-100 text-blue-700',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => { fetchUsers(); }, [statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '100');

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { fetchUsers(); }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusChange = async (userId, newStatus) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
      if (selectedUser?._id === userId) {
        setSelectedUser(data.data);
      }
    }
  };

  const viewUser = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedUser(data.data);
        setDetailOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-600 mt-1">Manage customer accounts and their status.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchQuery ? 'No users found' : 'No users registered yet.'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">User</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Registered</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {u.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 text-sm">{u.fullName}</p>
                          <p className="text-xs text-neutral-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-700">{u.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleStyles[u.role] || 'bg-neutral-100 text-neutral-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${statusStyles[u.status] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewUser(u._id)}
                          className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-orange-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {u.status !== 'active' && (
                          <button
                            onClick={() => handleStatusChange(u._id, 'active')}
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600"
                            title="Activate"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {u.status !== 'blocked' && (
                          <button
                            onClick={() => handleStatusChange(u._id, 'blocked')}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                            title="Block"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {u.status !== 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(u._id, 'suspended')}
                            className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600"
                            title="Suspend"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Dialog */}
      {detailOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  {selectedUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">{selectedUser.fullName}</h2>
                  <p className="text-sm text-neutral-500">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setDetailOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100">
                <XCircle className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Role */}
              <div className="flex gap-3">
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${statusStyles[selectedUser.status] || ''}`}>
                  {selectedUser.status}
                </span>
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${roleStyles[selectedUser.role] || ''}`}>
                  {selectedUser.role}
                </span>
              </div>

              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-neutral-50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-neutral-500">Full Name</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Email</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Phone</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedUser.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Registered</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Address Information</h3>
                {selectedUser.addresses?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.addresses.map((addr, i) => (
                      <div key={i} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-neutral-700 capitalize">{addr.label}</span>
                          {addr.isDefault && <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">Default</span>}
                        </div>
                        <p className="text-sm text-neutral-700">{addr.street}, {addr.city}{addr.state ? `, ${addr.state}` : ''} - {addr.zipCode}</p>
                        <p className="text-xs text-neutral-500">{addr.country}</p>
                        <p className="text-xs text-neutral-500">{addr.fullName} | {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">No addresses saved.</p>
                )}
              </div>

              {/* Order Info */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Order Information</h3>
                <UserOrders userId={selectedUser._id} />
              </div>

              {/* Status Management */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Account Status</h3>
                <div className="flex gap-2">
                  {['active', 'blocked', 'suspended'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedUser._id, s)}
                      disabled={selectedUser.status === s}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedUser.status === s
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                          : s === 'active'
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : s === 'blocked'
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close button for XCircle */}
      <style jsx global>{`
        .close-button { cursor: pointer; }
      `}</style>
    </div>
  );
}

function UserOrders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?admin=true&userId=${userId}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-sm text-neutral-500">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-sm text-neutral-500">No orders yet.</p>;

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div key={order._id} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-900">{order.orderNumber}</p>
            <p className="text-xs text-neutral-500">{new Date(order.createdAt).toLocaleDateString()} | {order.items?.length || 0} items</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-neutral-900">৳{order.total?.toFixed(2)}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>{order.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
