'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAgents, deleteAgent } from '@/lib/api';
import { AdminAgent } from '@/lib/types';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminAgentsPage() {
  const { user, token } = useAuth();
  const [agents, setAgents] = useState<AdminAgent[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminAgent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getAgents(token).then(setAgents);
  }, [token]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;

    setError('');
    setIsDeleting(true);

    const result = await deleteAgent(pendingDelete.id, token!);

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
      setPendingDelete(null);
      return;
    }

    setAgents((prev) => prev?.filter((a) => a.id !== pendingDelete.id) ?? null);
    setIsDeleting(false);
    setPendingDelete(null);
  }

  if (agents === null) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>;
  }

  if (agents.length === 0) {
    return <p className="text-[var(--color-ink)]/60 text-sm">No agents on the platform yet.</p>;
  }

  return (
    <div>
      {error && <p className="text-sm text-[var(--color-clay)] mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-stone-line)] text-left">
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Name</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Email</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Role</th>
              <th className="pb-3 pr-4 font-medium text-[var(--color-ink)]/50">Listings</th>
              <th className="pb-3 font-medium text-[var(--color-ink)]/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => {
              const isSelf = agent.id === user?.id;
              return (
                <tr key={agent.id} className="border-b border-[var(--color-stone-line)]">
                  {/* <td className="py-3 pr-4 text-[var(--color-ink)]">
                    {agent.name}
                    {isSelf && (
                      <span className="text-xs text-[var(--color-ink)]/40 ml-2">(you)</span>
                    )}
                  </td> */}
                  <td className="py-3 pr-4 text-[var(--color-ink)]">
                    <Link
                        href={`/admin/properties?agentId=${agent.id}`}
                        className="hover:text-[var(--color-forest)] hover:underline"
                    >
                        {agent.name}
                    </Link>
                    {isSelf && (
                        <span className="text-xs text-[var(--color-ink)]/40 ml-2">(you)</span>
                    )}
                    </td>
                  <td className="py-3 pr-4 text-[var(--color-ink)]/70">{agent.email}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 ${
                        agent.role === 'admin'
                          ? 'bg-[var(--color-brass)]/10 text-[var(--color-brass)]'
                          : 'bg-[var(--color-forest)]/10 text-[var(--color-forest)]'
                      }`}
                    >
                      {agent.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-ink)]/70">
                    {agent.properties.length}
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/admin/agents/${agent.id}/edit`}
                      className="text-[var(--color-brass)] hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    {isSelf ? (
                      <span className="text-[var(--color-ink)]/30">—</span>
                    ) : (
                      <button
                        onClick={() => setPendingDelete(agent)}
                        className="text-[var(--color-clay)] hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete agent"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.name}"? This can't be undone, and any properties they own will be affected.`
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