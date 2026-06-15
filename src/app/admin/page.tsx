'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAdminAuth } from '@/app/_components/AuthGuard';

// CHANGE PASSWORD HERE
const ADMIN_PASSWORD = 'Admin2026';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('ma_admin_authed') === 'true') {
      router.replace('/admin/generate');
    }
  }, [router]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminAuth();
      router.push('/admin/generate');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  }

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        {/* Wordmark */}
        <h1
          className="text-center text-navy font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 28 }}
        >
          Metabridge Academy
        </h1>

        {/* Tagline */}
        <p className="text-center text-gray-400 italic mb-5" style={{ fontSize: 13 }}>
          Gateway to Digital Literacy
        </p>

        {/* Divider */}
        <hr className="border-gray-200 mb-5" />

        {/* Section label */}
        <p
          className="text-center text-navy font-semibold mb-6"
          style={{ fontSize: 16 }}
        >
          Administrator Access
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Enter password"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal transition"
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Access Generator
          </button>
        </form>
      </div>
    </main>
  );
}
