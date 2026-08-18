'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProperties, deleteProperty } from '@/lib/api';
import { Property } from '@/lib/types';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminPropertiesPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const agentIdFilter = searchParams.get('agentId');

  const [properties, setProperties] = useState<Property[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProperties().then(setProperties);
  }, []);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;

    setError('');
    setIsDeleting(true);

    const result = await deleteProperty(pendingDelete.id, token!);

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
      setPendingDelete(null);
      return;
    }

    setProperties((prev) => prev?.filter((p) => p.id !== pendingDelete.id) ?? null);
    setIsDeleting(false);
    setPendingDelete(null);
  }

  if (properties === null) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>;
  }

  const visibleProperties = agentIdFilter
    ? properties.filter((p) => p.agent.id === agentIdFilter)
    : properties;

  const filteredAgentName = agentIdFilter
    ? properties.find((p) => p.agent.id === agentIdFilter)?.agent.name
    : null;

  if (visibleProperties.length === 0) {
    return (
      <div>
        {agentIdFilter && (
          <FilterBanner agentName={filteredAgentName} />
        )}
        <p className="text-[var(--color-ink)]/60 text-sm">
          {agentIdFilter ? 'This agent has no listings.' : 'No properties on the platform yet.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {agentIdFilter && <FilterBanner agentName={filteredAgentName} />}

      {error && <p className="text-sm text-[var(--color-clay)] mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-stone-line)] text-left">
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Title</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Agent</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Location</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Price</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Status</th>
              <th className="pb-3 font-medium text-[var(--color-ink)]/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleProperties.map((property) => (
              <tr key={property.id} className="border-b border-[var(--color-stone-line)]">
                <td className="py-3 pr-4 text-[var(--color-ink)]">{property.title}</td>
                <td className="py-3 pr-4 text-[var(--color-ink)]/70">{property.agent.name}</td>
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
                <td className="py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/properties/${property.id}?from=admin`}
                      className="text-[var(--color-forest)] hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-[var(--color-brass)] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setPendingDelete(property)}
                      className="text-[var(--color-clay)] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete property"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.title}" (listed by ${pendingDelete.agent.name})? This can't be undone.`
            : ''
        }
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function FilterBanner({ agentName }: { agentName: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between bg-[var(--color-paper)] border border-[var(--color-stone-line)] px-4 py-2 mb-4 text-sm">
      <span className="text-[var(--color-ink)]/70">
        Showing listings by <strong>{agentName ?? 'this agent'}</strong>
      </span>
      <Link href="/admin/properties" className="text-[var(--color-forest)] hover:underline">
        Clear filter
      </Link>
    </div>
  );
}