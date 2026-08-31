'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getClients, deleteClient } from '@/lib/api';
import { AdminClient } from '@/lib/types';
import ConfirmModal from '@/components/ConfirmModal';
import SearchInput from '@/components/SearchInput';

export default function AdminClientsPage() {
  const { token } = useAuth();
  const [clients, setClients] = useState<AdminClient[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminClient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    if (!token) return;
    getClients(token).then(setClients);
  }, [token]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;

    setError('');
    setIsDeleting(true);

    const result = await deleteClient(pendingDelete.id, token!);

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
      setPendingDelete(null);
      return;
    }

    setClients((prev) => prev?.filter((c) => c.id !== pendingDelete.id) ?? null);
    setIsDeleting(false);
    setPendingDelete(null);
  }

  const filteredClients = clients?.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  if (clients === null) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>;
  }

  if (clients.length === 0) {
    return <p className="text-[var(--color-ink)]/60 text-sm">No clients on the platform yet.</p>;
  }

  return (
    <div>
      {error && <p className="text-sm text-[var(--color-clay)] mb-4">{error}</p>}

      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search clients by name or email..." />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-stone-line)] text-left">
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Name</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Email</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Phone</th>
              <th className="pb-3 font-medium text-[var(--color-ink)]/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b border-[var(--color-stone-line)]">
                <td className="py-3 pr-4 text-[var(--color-ink)]">{client.name}</td>
                <td className="py-3 pr-4 text-[var(--color-ink)]/70">{client.email}</td>
                <td className="py-3 pr-4 text-[var(--color-ink)]/70">
                  {client.phone ?? '—'}
                </td>
                <td className="py-3">
                  <Link
                    href={`/admin/clients/${client.id}/edit`}
                    className="text-[var(--color-brass)] hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setPendingDelete(client)}
                    className="text-[var(--color-clay)] hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete client"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.name}"? This can't be undone, and any inquiries they've sent will be affected.`
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