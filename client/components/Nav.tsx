'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header className="border-b border-[var(--color-stone-line)] bg-white">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-[var(--color-ink)]">
          Capstone
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/properties"
            className="text-sm font-medium text-[var(--color-ink)]/70 hover:text-[var(--color-forest)] transition-colors"
          >
            Properties
          </Link>

                    {user ? (
            <div className="flex items-center gap-4">
                {user.userType === 'agent' && (
                <Link
                    href="/properties/new"
                    className="text-sm font-medium text-[var(--color-brass)] hover:text-[var(--color-ink)] transition-colors"
                >
                    + New listing
                </Link>
                )}
                <span className="text-sm text-[var(--color-ink)]/70">
                {user.name} <span className="text-[var(--color-ink)]/40">({user.userType})</span>
                </span>
                <button
                onClick={handleLogout}
                className="text-sm font-medium text-[var(--color-clay)] hover:text-[var(--color-ink)] transition-colors"
                >
                Logout
                </button>
            </div>
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
    </header>
  );
}