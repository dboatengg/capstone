'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getInquiries } from '@/lib/api';
import { Inquiry } from '@/lib/types';
import RequireAuth from '@/components/RequireAuth';

function InquiriesList() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  useEffect(() => {
    if (token) {
      getInquiries(token).then(setInquiries);
    }
  }, [token]);

  if (inquiries === null) {
    return <p className="text-[var(--color-ink)]/60">Loading inquiries...</p>;
  }

  if (inquiries.length === 0) {
    return <p className="text-[var(--color-ink)]/60">No inquiries yet.</p>;
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className="border border-[var(--color-stone-line)] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-[var(--color-ink)]">{inquiry.property.title}</p>
              <p className="text-sm text-[var(--color-ink)]/50">{inquiry.property.location}</p>
            </div>
            <span className="text-xs uppercase tracking-wide text-[var(--color-brass)] font-medium">
              {inquiry.status}
            </span>
          </div>

          <p className="text-sm text-[var(--color-ink)]/80 mt-3">{inquiry.message}</p>

          <p className="text-xs text-[var(--color-ink)]/50 mt-3">
            From {inquiry.client.name} ({inquiry.client.email})
          </p>
        </div>
      ))}
    </div>
  );
}

export default function InquiriesPage() {
  return (
    <RequireAuth allowedTypes={['agent']}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-[var(--color-ink)] mb-8">Inquiries</h1>
        <InquiriesList />
      </div>
    </RequireAuth>
  );
}