'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { deleteProperty } from '@/lib/api';
import ConfirmModal from '@/components/ConfirmModal';
import { useHasMounted } from '@/hooks/useHasMounted';

export default function PropertyOwnerActions({
  propertyId,
  ownerAgentId,
  propertyTitle,
}: {
  propertyId: string;
  ownerAgentId: string;
  propertyTitle: string;
}) {
  const { user, token } = useAuth();
  const router = useRouter();
  const hasMounted = useHasMounted();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!hasMounted) return null;

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.userType === 'agent' && user.id === ownerAgentId;

  if (!isAdmin && !isOwner) return null;

  const editHref = isAdmin
    ? `/admin/properties/${propertyId}/edit`
    : `/properties/${propertyId}/edit`;

  async function handleConfirmDelete() {
    setError('');
    setIsDeleting(true);

    const result = await deleteProperty(propertyId, token!);

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      return;
    }

    router.push(isAdmin ? '/admin/properties' : '/dashboard/listings');
  }

  return (
    <div className="flex items-center gap-4 bg-[var(--color-brass)]/10 border border-[var(--color-brass)]/30 px-4 py-3 mb-6">
      <span className="text-sm font-medium text-[var(--color-brass)]">
        {isAdmin ? 'Admin controls' : 'You own this listing'}
      </span>

      <div className="flex items-center gap-4 ml-auto">
        <Link
          href={editHref}
          className="text-sm font-medium text-[var(--color-forest)] hover:underline"
        >
          Edit listing
        </Link>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-sm font-medium text-[var(--color-clay)] hover:underline"
        >
          Delete
        </button>
      </div>

      {error && <p className="text-sm text-[var(--color-clay)] mt-2 w-full">{error}</p>}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete listing"
        message={`Are you sure you want to delete "${propertyTitle}"? This can't be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}