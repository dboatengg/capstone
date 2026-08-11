'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createInquiry } from '@/lib/api';

export default function InquiryForm({
    propertyId,
    available,
  }: {
    propertyId: string;
    available: boolean;
  }) {
    const { user, token } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
  
    if (!available) {
      return (
        <p className="text-sm text-[var(--color-ink)]/60">
          This property is no longer available for inquiries.
        </p>
      );
    }

  // Not logged in at all
  if (!user) {
    return (
      <p className="text-sm text-[var(--color-ink)]/60">
        <a href="/login" className="text-[var(--color-forest)] font-medium hover:underline">
          Log in
        </a>{' '}
        as a client to ask about this property.
      </p>
    );
  }

  // Logged in, but as an agent, not a client — inquiries are client-only per the backend
  if (user.userType !== 'client') {
    return null;
  }

  if (sent) {
    return (
      <p className="text-sm text-[var(--color-forest)] font-medium">
        Your inquiry has been sent. The agent will get back to you soon.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await createInquiry(propertyId, message, token!);

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="message" className="block text-sm font-medium text-[var(--color-ink)]/70">
        Ask about this property
      </label>
      <textarea
        id="message"
        required
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Hi, I'm interested in this property. Is it still available?"
        className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
      />

      {error && <p className="text-sm text-[var(--color-clay)]">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[var(--color-forest)] text-white text-sm font-medium px-5 py-2 hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send inquiry'}
      </button>
    </form>
  );
}