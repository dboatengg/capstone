'use client';

import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-ink)] mb-8">Profile</h1>

      <div className="border border-[var(--color-stone-line)] bg-white p-6 max-w-md">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-1">Name</p>
        <p className="text-[var(--color-ink)] mb-4">{user?.name}</p>

        <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-1">Email</p>
        <p className="text-[var(--color-ink)] mb-4">{user?.email}</p>

        <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-1">Role</p>
        <p className="text-[var(--color-ink)] capitalize">{user?.userType}</p>
      </div>

      <p className="text-sm text-[var(--color-ink)]/50 mt-4">
        Editing profile details isn&apos;t available yet.
      </p>
    </div>
  );
}