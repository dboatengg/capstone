'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getInquiries } from '@/lib/api';
import { Inquiry } from '@/lib/types';
import InquiryCard from '@/components/InquiryCard';

export default function AdminInquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  useEffect(() => {
    if (token) {
      getInquiries(token).then(setInquiries);
    }
  }, [token]);

  function handleDeleted(id: string) {
    setInquiries((prev) => prev?.filter((i) => i.id !== id) ?? null);
  }

  if (inquiries === null) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>;
  }

  if (inquiries.length === 0) {
    return <p className="text-[var(--color-ink)]/60 text-sm">No inquiries on the platform yet.</p>;
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <InquiryCard
          key={inquiry.id}
          inquiry={inquiry}
          showDelete
          showAgent
          onDeleted={handleDeleted}
        />
      ))}
    </div>
  );
}