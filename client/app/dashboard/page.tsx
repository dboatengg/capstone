'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getProperties, getInquiries } from '@/lib/api';
import { Property, Inquiry } from '@/lib/types';
import InquiryCard from '@/components/InquiryCard';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [myListings, setMyListings] = useState<Property[] | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    getProperties().then((properties) => {
      if (properties) {
        setMyListings(properties.filter((p) => p.agent.id === user.id));
      }
    });

    getInquiries(token).then(setInquiries);
  }, [user, token]);

  const activeCount = myListings?.filter((p) => p.available).length ?? 0;
  const totalCount = myListings?.length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[var(--color-ink)]">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-[var(--color-ink)]/60 mt-1">{user?.email}</p>
        </div>
        <Link
          href="/properties/new"
          className="bg-[var(--color-forest)] text-white text-sm font-medium px-5 py-3 hover:bg-[var(--color-ink)] transition-colors"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 96% 100%, 0 100%)' }}
        >
          + Create Listing
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="border border-[var(--color-stone-line)] bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
            Active Listings
          </p>
          <p className="font-display text-3xl text-[var(--color-forest)] mt-1">{activeCount}</p>
        </div>
        <div className="border border-[var(--color-stone-line)] bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
            Total Listings
          </p>
          <p className="font-display text-3xl text-[var(--color-ink)] mt-1">{totalCount}</p>
        </div>
        <div className="border border-[var(--color-stone-line)] bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50">Inquiries</p>
          <p className="font-display text-3xl text-[var(--color-brass)] mt-1">
            {inquiries?.length ?? '—'}
          </p>
        </div>
      </div>

      {/* Recent inquiries preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-[var(--color-ink)]">Recent Inquiries</h2>
          <Link
            href="/inquiries"
            className="text-sm font-medium text-[var(--color-forest)] hover:underline"
          >
            View all →
          </Link>
        </div>

        {inquiries === null ? (
          <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-[var(--color-ink)]/60 text-sm">No inquiries yet.</p>
        ) : (
          <div className="space-y-4">
            {inquiries.slice(0, 3).map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}