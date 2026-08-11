'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getInquiries } from '@/lib/api';
import { Inquiry } from '@/lib/types';
import RequireAuth from '@/components/RequireAuth';
import InquiryCard from '@/components/InquiryCard';

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
        <InquiryCard key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  );
}

export default function InquiriesPage() {
  return (
    <RequireAuth allowedTypes={['agent']}>
      <h1 className="font-display text-3xl text-[var(--color-ink)] mb-8">Inquiries</h1>
      <InquiriesList />
    </RequireAuth>
  );
}