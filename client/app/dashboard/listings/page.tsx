'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getProperties, deleteProperty } from '@/lib/api';
import { Property } from '@/lib/types';

export default function ListingsPage() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState<Property[] | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    getProperties().then((properties) => {
      if (properties) {
        setListings(properties.filter((p) => p.agent.id === user.id));
      }
    });
  }, [user]);

  async function handleDelete(id: string) {
    setError('');
    setDeletingId(id);

    const result = await deleteProperty(id, token!);

    if (!result.success) {
      setError(result.error);
      setDeletingId(null);
      setConfirmingId(null);
      return;
    }

    setListings((prev) => prev?.filter((p) => p.id !== id) ?? null);
    setDeletingId(null);
    setConfirmingId(null);
  }

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

      {error && <p className="text-sm text-[var(--color-clay)] mb-4">{error}</p>}

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
                    {confirmingId === property.id ? (
                      <div className="flex items-center gap-3">
                        <span className="text-[var(--color-ink)]/70">Delete?</span>
                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={deletingId === property.id}
                          className="text-[var(--color-clay)] font-medium hover:underline disabled:opacity-50"
                        >
                          {deletingId === property.id ? 'Deleting...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="text-[var(--color-ink)]/50 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-[var(--color-forest)] hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/properties/${property.id}/edit`}
                          className="text-[var(--color-brass)] hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setConfirmingId(property.id)}
                          className="text-[var(--color-clay)] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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