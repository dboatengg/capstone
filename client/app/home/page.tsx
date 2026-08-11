'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getProperties } from '@/lib/api';
import { Property } from '@/lib/types';
import RequireAuth from '@/components/RequireAuth';
import PropertyCard from '@/components/PropertyCard';

function NewestListings() {
  const [listings, setListings] = useState<Property[] | null>(null);

  useEffect(() => {
    getProperties().then((properties) => {
      if (properties) {
        const sorted = [...properties].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setListings(sorted.slice(0, 4));
      }
    });
  }, []);

  if (listings === null) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>;
  }

  if (listings.length === 0) {
    return <p className="text-[var(--color-ink)]/60 text-sm">No listings yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {listings.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

export default function ClientHomePage() {
  const { user } = useAuth();

  return (
    <RequireAuth allowedTypes={['client']}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl text-[var(--color-ink)]">
              Welcome back, {user?.name}
            </h1>
            <p className="text-sm text-[var(--color-ink)]/60 mt-1">
              Find your next home across Accra and Kumasi.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-[var(--color-forest)] text-white text-sm font-medium px-6 py-3 hover:bg-[var(--color-ink)] transition-colors self-start sm:self-auto"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 96% 100%, 0 100%)' }}
          >
            Continue searching →
          </Link>
        </div>

        <div>
          <h2 className="font-display text-xl text-[var(--color-ink)] mb-4">Newest Listings</h2>
          <NewestListings />
        </div>
      </div>
    </RequireAuth>
  );
}