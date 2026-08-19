'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateInquiryStatus, deleteInquiry } from '@/lib/api';
import { Inquiry } from '@/lib/types';
import ConfirmModal from '@/components/ConfirmModal';

const STATUS_OPTIONS = ['pending', 'contacted', 'converted', 'lost'] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--color-brass)',
  contacted: 'var(--color-ink)',
  converted: 'var(--color-forest)',
  lost: 'var(--color-clay)',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  contacted: 'Contacted',
  converted: 'Converted',
  lost: 'Lost',
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
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleStatusChange(newStatus: string) {
    setIsStatusOpen(false);
    if (newStatus === status) return;

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
    <div className="flex border border-[var(--color-stone-line)] bg-white overflow-hidden">
      <div className="w-1.5 shrink-0" style={{ backgroundColor: STATUS_COLORS[status] }} />

      <div className="flex-1 p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <p className="font-medium text-[var(--color-ink)]">{inquiry.property.title}</p>
            <p className="text-sm text-[var(--color-ink)]/50">{inquiry.property.location}</p>
            {showAgent && (
              <p className="text-xs text-[var(--color-ink)]/40 mt-1">
                Agent: {inquiry.property.agent.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-start">
            <div className="relative" ref={statusRef}>
              <button
                type="button"
                onClick={() => setIsStatusOpen((open) => !open)}
                disabled={isUpdating}
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide pl-2.5 pr-2 py-1.5 border transition-opacity disabled:opacity-50"
                style={{
                  color: STATUS_COLORS[status],
                  borderColor: STATUS_COLORS[status],
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                />
                {isUpdating ? 'Saving…' : STATUS_LABELS[status]}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  className={`shrink-0 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isStatusOpen && (
                <div className="absolute right-0 z-10 mt-1 w-36 border border-[var(--color-stone-line)] bg-white shadow-md">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleStatusChange(option)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-wide text-left hover:bg-[var(--color-paper)] transition-colors"
                      style={{ color: option === status ? STATUS_COLORS[option] : 'var(--color-ink)' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: STATUS_COLORS[option] }}
                      />
                      {STATUS_LABELS[option]}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
      </div>

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