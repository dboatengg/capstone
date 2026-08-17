'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/ConfirmModal';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleConfirmLogout() {
    logout();
    setShowLogoutConfirm(false);
    setIsMenuOpen(false);
    router.push('/');
  }

  const isAgent = user?.userType === 'agent';
  const isClient = user?.userType === 'client';

  const linkClass =
    'text-sm font-medium text-[var(--color-ink)]/70 hover:text-[var(--color-forest)] transition-colors';
  const mobileLinkClass =
    'block py-3 text-sm font-medium text-[var(--color-ink)]/70 hover:text-[var(--color-forest)] transition-colors border-b border-[var(--color-stone-line)]';

  return (
    <header className="border-b border-[var(--color-stone-line)] bg-white relative">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href={isAgent ? '/dashboard' : isClient ? '/home' : '/'}
          className="font-display text-xl text-[var(--color-ink)]"
          onClick={() => setIsMenuOpen(false)}
        >
          Capstone
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {isAgent && (
            <Link href="/dashboard" className={linkClass}>
              Dashboard
            </Link>
          )}

          {isClient && (
            <Link href="/home" className={linkClass}>
              Home
            </Link>
          )}

          <Link href="/properties" className={linkClass}>
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

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className="sm:hidden text-[var(--color-ink)] p-1"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-[var(--color-stone-line)] bg-white px-6 py-2">
          {isAgent && (
            <Link href="/dashboard" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          )}

          {isClient && (
            <Link href="/home" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          )}

          <Link href="/properties" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>
            Properties
          </Link>

          {user ? (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="block w-full text-left py-3 text-sm font-medium text-[var(--color-clay)] hover:text-[var(--color-ink)] transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="block py-3 text-sm font-medium text-[var(--color-forest)] hover:text-[var(--color-ink)] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </Link>
          )}
        </div>
      )}

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