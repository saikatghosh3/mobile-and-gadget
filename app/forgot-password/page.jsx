'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (data.resetUrl) setResetUrl(data.resetUrl);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">Forgot Password</h1>
              <p className="text-neutral-500 mt-1">Enter your email to reset your password</p>
            </div>

            {submitted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-neutral-700 text-sm">
                  If an account exists with that email, a reset link has been sent.
                </p>
                {resetUrl && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm">
                    <p className="text-blue-700 font-medium mb-1">Reset Link (Dev Mode):</p>
                    <a href={resetUrl} className="text-blue-600 break-all hover:underline">{resetUrl}</a>
                  </div>
                )}
                <Link href="/login" className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
