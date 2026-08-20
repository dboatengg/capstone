'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useHasMounted } from '@/hooks/useHasMounted';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const hasMounted = useHasMounted();

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.userType === 'agent' && !isAdmin;
  const isClient = user?.userType === 'client';

  useEffect(() => {
    if (!hasMounted) return;

    if (isAdmin) {
      router.replace('/admin');
    } else if (isAgent) {
      router.replace('/dashboard');
    } else if (isClient) {
      router.replace('/home');
    }
  }, [hasMounted, isAdmin, isAgent, isClient, router]);

  // Don't render the public homepage at all until we know for certain
  // this visitor isn't logged in — avoids flashing it before redirecting.
  if (!hasMounted || isAdmin || isAgent || isClient) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-[var(--color-ink)]/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-paper)]">
      <main className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-medium uppercase tracking-wide text-[var(--color-forest)] mb-4">
            Accra · Kumasi
          </span>

          <h1 className="font-display text-5xl sm:text-6xl leading-[1.1] text-[var(--color-ink)]">
          Find the home you&apos;ve been looking for.
          </h1>

          <p className="text-lg text-[var(--color-ink)]/70 mt-6 leading-relaxed max-w-lg">
          Capstone connects you directly with trusted agents across Ghana. Browse verified listings for rent or sale.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-[var(--color-forest)] text-white text-sm font-medium px-6 py-3 hover:bg-[var(--color-ink)] transition-colors"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 96% 100%, 0 100%)' }}
            >
              Browse properties →
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-[var(--color-ink)]/20 text-[var(--color-ink)] text-sm font-medium px-6 py-3 hover:border-[var(--color-forest)] hover:text-[var(--color-forest)] transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="flex gap-1.5 mt-24">
          <div className="h-1.5 w-16 bg-[var(--color-forest)]" />
          <div className="h-1.5 w-16 bg-[var(--color-brass)]" />
          <div className="h-1.5 w-16 bg-[var(--color-clay)]" />
        </div>
      </main>
    </div>
  );
}