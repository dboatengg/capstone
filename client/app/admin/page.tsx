'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type DashboardStats = {
  properties: number;
  agents: number;
  clients: number;
  inquiries: number;
};

export default function AdminPage() {
    const { user, token } = useAuth();
    const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
  
    if (user?.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [token, user, router]);


  useEffect(() => {
    async function fetchDashboardStats() {
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load dashboard');
          return;
        }

        setStats(data);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError('Something went wrong loading the dashboard.');
      }
    }

    fetchDashboardStats();
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p>You must be logged in to access the admin dashboard.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-[var(--color-clay)]">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-[var(--color-stone-line)] p-6">
          <p className="text-sm text-[var(--color-ink)]/60">
            Properties
          </p>
          <p className="text-3xl font-display mt-2">
            {stats.properties}
          </p>
        </div>

        <div className="border border-[var(--color-stone-line)] p-6">
          <p className="text-sm text-[var(--color-ink)]/60">
            Agents
          </p>
          <p className="text-3xl font-display mt-2">
            {stats.agents}
          </p>
        </div>

        <div className="border border-[var(--color-stone-line)] p-6">
          <p className="text-sm text-[var(--color-ink)]/60">
            Clients
          </p>
          <p className="text-3xl font-display mt-2">
            {stats.clients}
          </p>
        </div>

        <div className="border border-[var(--color-stone-line)] p-6">
          <p className="text-sm text-[var(--color-ink)]/60">
            Inquiries
          </p>
          <p className="text-3xl font-display mt-2">
            {stats.inquiries}
          </p>
        </div>
      </div>
    </div>
  );
}