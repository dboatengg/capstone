'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateInquiryStatus } from '@/lib/api';
import { Inquiry } from '@/lib/types';

const STATUS_OPTIONS = ['pending', 'contacted', 'converted', 'lost'] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--color-brass)',
  contacted: 'var(--color-forest)',
  converted: 'var(--color-forest)',
  lost: 'var(--color-clay)',
};

export default function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const { token } = useAuth();
  const [status, setStatus] = useState(inquiry.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="border border-[var(--color-stone-line)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-[var(--color-ink)]">{inquiry.property.title}</p>
          <p className="text-sm text-[var(--color-ink)]/50">{inquiry.property.location}</p>
        </div>

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
      </div>

      <p className="text-sm text-[var(--color-ink)]/80 mt-3">{inquiry.message}</p>

      <p className="text-xs text-[var(--color-ink)]/50 mt-3">
        From {inquiry.client.name} ({inquiry.client.email})
      </p>

      {error && <p className="text-sm text-[var(--color-clay)] mt-2">{error}</p>}
    </div>
  );
}