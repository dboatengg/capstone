'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/ConfirmModal';

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function handleConfirmLogout() {
    logout();
    setShowLogoutConfirm(false);
    router.push('/');
  }

  const isAgent = user?.userType === 'agent';
  const isClient = user?.userType === 'client';

  return (
    <header className="border-b border-[var(--color-stone-line)] bg-white">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href={isAgent ? '/dashboard' : isClient ? '/home' : '/'}
          className="font-display text-xl text-[var(--color-ink)]"
        >
          Capstone
        </Link>

        <div className="flex items-center gap-6">
          {isAgent && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[var(--color-ink)]/70 hover:text-[var(--color-forest)] transition-colors"
            >
              Dashboard
            </Link>
          )}

          {isClient && (
            <Link
              href="/home"
              className="text-sm font-medium text-[var(--color-ink)]/70 hover:text-[var(--color-forest)] transition-colors"
            >
              Home
            </Link>
          )}

          <Link
            href="/properties"
            className="text-sm font-medium text-[var(--color-ink)]/70 hover:text-[var(--color-forest)] transition-colors"
          >
            Properties
          </Link>

          {user ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-sm font-medium text-[var(--color-clay)] hover:text-[var(--color-ink)] transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--color-forest)] hover:text-[var(--color-ink)] transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmLabel="Log out"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </header>
  );
}