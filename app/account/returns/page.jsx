'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RotateCcw, Search, Package } from 'lucide-react';

export default function AccountReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      const res = await fetch(`/api/returns?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReturns(data.data);
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-blue-100 text-blue-700 border-blue-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      returned: 'bg-green-100 text-green-700 border-green-200',
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${styles[status] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredReturns = returns.filter((r) =>
    r.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Returns</h1>
        <p className="text-neutral-500 mt-1">Track the status of your return requests.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4" />
          <p className="text-neutral-500 text-sm">Loading returns...</p>
        </div>
      ) : filteredReturns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <RotateCcw className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-sm mb-4">
            {searchQuery ? 'No returns match your search' : 'You haven\'t submitted any return requests yet'}
          </p>
          {!searchQuery && (
            <Link href="/account/orders" className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-sm">
              View My Orders
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReturns.map((ret) => (
            <div key={ret._id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{ret.orderNumber}</span>
                      {statusBadge(ret.status)}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Submitted {new Date(ret.createdAt).toLocaleDateString()} at {new Date(ret.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Reason</p>
                    <p className="text-neutral-700">{ret.reason}</p>
                  </div>
                  {ret.details && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Details</p>
                      <p className="text-neutral-700">{ret.details}</p>
                    </div>
                  )}
                  {ret.adminNotes && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Admin Response</p>
                      <p className="text-neutral-700 bg-blue-50 p-3 rounded-xl">{ret.adminNotes}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Items</p>
                    <div className="space-y-1">
                      {ret.items.map((item, i) => (
                        <p key={i} className="text-neutral-700 text-xs">{item.name} x {item.quantity}</p>
                      ))}
                    </div>
                  </div>
                  {ret.images?.length > 0 && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Attached Images</p>
                      <div className="flex gap-2">
                        {ret.images.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-neutral-200 hover:opacity-80 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
