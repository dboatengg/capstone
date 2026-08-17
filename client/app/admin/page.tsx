'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import RequireAuth from '@/components/RequireAuth';

type DashboardStats = {
  properties: number;
  agents: number;
  clients: number;
  inquiries: number;
};

function AdminStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardStats() {
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load dashboard');
          return;
        }

        setStats(data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Something went wrong loading the dashboard.');
      }
    }

    fetchDashboardStats();
  }, [token]);

  if (error) {
    return <p className="text-[var(--color-clay)]">{error}</p>;
  }

  if (!stats) {
    return <p className="text-[var(--color-ink)]/60">Loading dashboard...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="border border-[var(--color-stone-line)] p-6">
        <p className="text-sm text-[var(--color-ink)]/60">Properties</p>
        <p className="text-3xl font-display mt-2">{stats.properties}</p>
      </div>

      <div className="border border-[var(--color-stone-line)] p-6">
        <p className="text-sm text-[var(--color-ink)]/60">Agents</p>
        <p className="text-3xl font-display mt-2">{stats.agents}</p>
      </div>

      <div className="border border-[var(--color-stone-line)] p-6">
        <p className="text-sm text-[var(--color-ink)]/60">Clients</p>
        <p className="text-3xl font-display mt-2">{stats.clients}</p>
      </div>

      <div className="border border-[var(--color-stone-line)] p-6">
        <p className="text-sm text-[var(--color-ink)]/60">Inquiries</p>
        <p className="text-3xl font-display mt-2">{stats.inquiries}</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    // <RequireAuth allowedTypes={['agent']}>
    <RequireAuth allowedTypes={['agent']} requireRole="admin">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl mb-8">Admin Dashboard</h1>
        <AdminStats />
      </div>
    </RequireAuth>
  );
}