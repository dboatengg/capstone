'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { uploadAgentProfileImage, uploadClientProfileImage } from '@/lib/api';
import AvatarUpload from '@/components/AvatarUpload';

export default function ProfilePage() {
  const { user, token, login } = useAuth();
  const [error, setError] = useState('');

  async function handleUpload(file: File) {
    if (!user || !token) return;
    setError('');

    const result =
      user.userType === 'agent'
        ? await uploadAgentProfileImage(user.id, file, token)
        : await uploadClientProfileImage(user.id, file, token);

    if (result.success) {
      // Update the stored user so the new photo shows immediately, everywhere (e.g. nav)
      login({ ...user, profileImage: result.profileImage }, token);
    } else {
      setError(result.error);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--color-ink)] mb-8">Profile</h1>
      <div className="border border-[var(--color-stone-line)] bg-white p-6 max-w-md">
        <AvatarUpload
          currentImage={user?.profileImage ?? null}
          name={user?.name ?? ''}
          onUpload={handleUpload}
        />

        {error && <p className="text-sm text-[var(--color-clay)] mt-3">{error}</p>}

        <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-1 mt-6">Name</p>
        <p className="text-[var(--color-ink)] mb-4">{user?.name}</p>
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-1">Email</p>
        <p className="text-[var(--color-ink)] mb-4">{user?.email}</p>
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-1">Role</p>
        <p className="text-[var(--color-ink)] capitalize">{user?.userType}</p>
      </div>
      <p className="text-sm text-[var(--color-ink)]/50 mt-4">
        Editing other profile details isn&apos;t available yet.
      </p>
    </div>
  );
}