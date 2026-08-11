'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getProperties } from '@/lib/api';
import { Property } from '@/lib/types';

export default function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Property[] | null>(null);

  useEffect(() => {
    if (!user) return;
    getProperties().then((properties) => {
      if (properties) {
        setListings(properties.filter((p) => p.agent.id === user.id));
      }
    });
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-[var(--color-ink)]">My Listings</h1>
        <Link
          href="/properties/new"
          className="bg-[var(--color-forest)] text-white text-sm font-medium px-5 py-3 hover:bg-[var(--color-ink)] transition-colors"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 96% 100%, 0 100%)' }}
        >
          + Create Listing
        </Link>
      </div>

      {listings === null ? (
        <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-[var(--color-ink)]/60 text-sm">
          You haven&apos;t listed any properties yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-stone-line)] text-left">
                <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Title</th>
                <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Location</th>
                <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Price</th>
                <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Status</th>
                <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Updated</th>
                <th className="pb-3 font-medium text-[var(--color-ink)]/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((property) => (
                <tr key={property.id} className="border-b border-[var(--color-stone-line)]">
                  <td className="py-3 pr-4 text-[var(--color-ink)]">{property.title}</td>
                  <td className="py-3 pr-4 text-[var(--color-ink)]/70">{property.location}</td>
                  <td className="py-3 pr-4 text-[var(--color-ink)]/70">
                    GHS {property.price.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 ${
                        property.available
                          ? 'bg-[var(--color-forest)]/10 text-[var(--color-forest)]'
                          : 'bg-[var(--color-clay)]/10 text-[var(--color-clay)]'
                      }`}
                    >
                      {property.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-ink)]/50">
                    {new Date(property.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/properties/${property.id}`}
                      className="text-[var(--color-forest)] hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}