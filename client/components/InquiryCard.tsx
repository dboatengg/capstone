'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateInquiryStatus, deleteInquiry } from '@/lib/api';
import { Inquiry } from '@/lib/types';
import ConfirmModal from '@/components/ConfirmModal';

const STATUS_OPTIONS = ['pending', 'contacted', 'converted', 'lost'] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--color-brass)',
  contacted: 'var(--color-forest)',
  converted: 'var(--color-forest)',
  lost: 'var(--color-clay)',
};

type Props = {
  inquiry: Inquiry;
  showDelete?: boolean;
  showAgent?: boolean;
  onDeleted?: (id: string) => void;
};

export default function InquiryCard({ inquiry, showDelete = false, showAgent = false, onDeleted }: Props) {
  const { token } = useAuth();
  const [status, setStatus] = useState(inquiry.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setError('');
    setIsUpdating(true);

    const result = await updateInquiryStatus(inquiry.id, newStatus, token!);

    if (!result.success) {
      setError(result.error);
      setIsUpdating(false);
      return;
    }

    setStatus(newStatus);
    setIsUpdating(false);
  }

  async function handleConfirmDelete() {
    setError('');
    setIsDeleting(true);

    const result = await deleteInquiry(inquiry.id, token!);

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      return;
    }

    setIsDeleting(false);
    setShowDeleteConfirm(false);
    onDeleted?.(inquiry.id);
  }

  return (
    <div className="border border-[var(--color-stone-line)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-[var(--color-ink)]">{inquiry.property.title}</p>
          <p className="text-sm text-[var(--color-ink)]/50">{inquiry.property.location}</p>
          {showAgent && (
            <p className="text-xs text-[var(--color-ink)]/40 mt-1">
              Agent: {inquiry.property.agent.name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="text-xs font-medium uppercase tracking-wide px-2 py-1 border focus:outline-none disabled:opacity-50"
            style={{
              color: STATUS_COLORS[status],
              borderColor: STATUS_COLORS[status],
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {showDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs font-medium text-[var(--color-clay)] hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--color-ink)]/80 mt-3">{inquiry.message}</p>

      <p className="text-xs text-[var(--color-ink)]/50 mt-3">
        From {inquiry.client.name} ({inquiry.client.email})
      </p>

      {error && <p className="text-sm text-[var(--color-clay)] mt-2">{error}</p>}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete inquiry"
        message={`Are you sure you want to delete this inquiry from ${inquiry.client.name}? This can't be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}