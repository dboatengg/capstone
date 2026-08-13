'use client';

import { useEffect } from 'react';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  isConfirming = false,
  onConfirm,
  onCancel,
}: Props) {
  // Let Escape close the modal, matching expected modal behavior
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white max-w-sm w-full p-6 shadow-lg">
        <h2 className="font-display text-xl text-[var(--color-ink)] mb-2">{title}</h2>
        <p className="text-sm text-[var(--color-ink)]/70 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isConfirming}
            className="text-sm font-medium text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] px-4 py-2 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="bg-[var(--color-clay)] text-white text-sm font-medium px-4 py-2 hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50"
          >
            {isConfirming ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}