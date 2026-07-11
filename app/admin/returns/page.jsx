'use client';

import { useEffect, useState } from 'react';
import { RotateCcw, Eye, Search, XCircle, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STATUS_OPTIONS = ['pending', 'approved', 'rejected', 'returned'];

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [editDialog, setEditDialog] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  const fetchReturns = async () => {
    try {
      const url = statusFilter === 'all'
        ? '/api/returns'
        : `/api/returns?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setReturns(data.data);
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReturn = async (id, updates) => {
    try {
      const res = await fetch(`/api/returns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        fetchReturns();
        if (selectedReturn && selectedReturn._id === id) {
          setSelectedReturn(data.data);
        }
      }
      return data;
    } catch (error) {
      console.error('Error updating return:', error);
      return { success: false, error: 'Failed to update' };
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this return request? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/returns/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchReturns();
        if (selectedReturn && selectedReturn._id === id) setSelectedReturn(null);
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting return:', error);
      alert('Failed to delete');
    }
  };

  const openEdit = (ret) => {
    setEditDialog(ret);
    setEditStatus(ret.status);
    setEditNotes(ret.adminNotes || '');
  };

  const saveEdit = async () => {
    const result = await updateReturn(editDialog._id, {
      status: editStatus,
      adminNotes: editNotes,
    });
    if (result.success) {
      setEditDialog(null);
    } else {
      alert(result.error || 'Failed to update');
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-250',
      approved: 'bg-blue-100 text-blue-700 border-blue-250',
      rejected: 'bg-red-100 text-red-700 border-red-250',
      returned: 'bg-green-100 text-green-700 border-green-250',
    };
    return (
      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
        {status}
      </span>
    );
  };

  const quickActions = (ret) => {
    const buttons = [];
    switch (ret.status) {
      case 'pending':
        buttons.push(
          <Button key="approve" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-2.5 font-semibold"
            onClick={() => updateReturn(ret._id, { status: 'approved', adminNotes: ret.adminNotes || 'Return approved. Please ship the item back.' })}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Approve
          </Button>,
          <Button key="reject" size="sm" variant="destructive" className="h-8 px-2.5"
            onClick={() => updateReturn(ret._id, { status: 'rejected', adminNotes: ret.adminNotes || 'Return request rejected. Please contact support for details.' })}
          >
            <XCircle className="w-4 h-4 mr-1" /> Reject
          </Button>
        );
        break;
      case 'approved':
        buttons.push(
          <Button key="returned" size="sm" className="bg-green-500 hover:bg-green-600 text-white h-8 px-2.5 font-semibold"
            onClick={() => updateReturn(ret._id, { status: 'returned', adminNotes: ret.adminNotes || 'Return completed. Refund has been issued.' })}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Mark Returned
          </Button>
        );
        break;
    }
    return buttons;
  };

  const filteredReturns = returns.filter((ret) => {
    const orderNum = ret.orderNumber || '';
    const reason = ret.reason || '';
    const search = searchQuery.toLowerCase();
    return orderNum.toLowerCase().includes(search) || reason.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Return Management</h1>
          <p className="text-neutral-600 mt-1">Review and manage customer return requests</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order number or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white border border-neutral-300 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Returns</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading returns...</div>
      ) : filteredReturns.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 border border-neutral-200 rounded-2xl bg-white">
          {searchQuery ? 'No matching returns found' : 'No return requests yet'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Order</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Reason</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Items</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-28">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-28">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-72 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredReturns.map((ret) => (
                  <tr key={ret._id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-neutral-900">{ret.orderNumber}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-neutral-700 truncate">{ret.reason}</p>
                      {ret.details && (
                        <p className="text-xs text-neutral-400 truncate">{ret.details}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-neutral-700">
                        {ret.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(ret.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {new Date(ret.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReturn(ret)}
                          className="h-8 px-2.5"
                        >
                          <Eye className="w-4 h-4 text-neutral-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(ret)}
                          className="h-8 px-2.5"
                        >
                          Edit
                        </Button>
                        {quickActions(ret)}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(ret._id)}
                          className="h-8 px-2.5"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Return Request Details</DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Order</p>
                  <p className="font-semibold text-lg">{selectedReturn.orderNumber}</p>
                </div>
                {statusBadge(selectedReturn.status)}
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">Return Reason</h4>
                <p className="text-sm text-neutral-700">{selectedReturn.reason}</p>
              </div>

              {selectedReturn.details && (
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Customer Details</h4>
                  <p className="text-sm text-neutral-700">{selectedReturn.details}</p>
                </div>
              )}

              {selectedReturn.images?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Attached Images</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedReturn.images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt="" className="w-20 h-20 rounded-lg object-cover border border-neutral-200 hover:opacity-80 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">Return Items</h4>
                <div className="space-y-2">
                  {selectedReturn.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 text-sm">
                      <span className="font-medium text-neutral-700">{item.name}</span>
                      <span className="text-neutral-500">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">Submitted</h4>
                <p className="text-sm text-neutral-600">
                  {new Date(selectedReturn.createdAt).toLocaleString()}
                </p>
              </div>

              {selectedReturn.adminNotes && (
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Admin Notes</h4>
                  <p className="text-sm bg-blue-50 p-3 rounded-xl text-neutral-700">{selectedReturn.adminNotes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200">
                {quickActions(selectedReturn)}
                <Button variant="outline" size="sm" onClick={() => { setSelectedReturn(null); openEdit(selectedReturn); }} className="h-8">
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(selectedReturn._id)} className="h-8">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Return Request</DialogTitle>
          </DialogHeader>
          {editDialog && (
            <div className="space-y-5">
              <p className="text-sm text-neutral-500">
                Order: <span className="font-semibold text-neutral-700">{editDialog.orderNumber}</span>
              </p>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="w-full bg-white border border-neutral-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Admin Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Notes about this return request..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditDialog(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={saveEdit} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
