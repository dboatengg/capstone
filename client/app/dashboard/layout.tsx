'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/listings', label: 'Listings' },
  { href: '/dashboard/inquiries', label: 'Inquiries' },
  { href: '/dashboard/profile', label: 'Profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RequireAuth allowedTypes={['agent']}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile-only header with hamburger toggle */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <span className="font-display text-lg text-[var(--color-ink)]">Dashboard</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
            className="p-2 border border-[var(--color-stone-line)]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 5H17M3 10H17M3 15H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar — always visible at md and up */}
          <aside className="hidden md:block w-48 shrink-0">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium px-3 py-2 transition-colors ${
                      isActive
                        ? 'bg-[var(--color-forest)] text-white'
                        : 'text-[var(--color-ink)]/70 hover:bg-[var(--color-paper)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Mobile drawer — slides in over content when open */}
          {isSidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              {/* Backdrop — click to close */}
              <div
                className="fixed inset-0 bg-black/40"
                onClick={() => setIsSidebarOpen(false)}
              />

              <aside className="relative w-64 bg-white h-full p-6 flex flex-col gap-1 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-lg text-[var(--color-ink)]">Menu</span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close menu"
                    className="p-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M4 4L14 14M14 4L4 14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`text-sm font-medium px-3 py-2 transition-colors ${
                        isActive
                          ? 'bg-[var(--color-forest)] text-white'
                          : 'text-[var(--color-ink)]/70 hover:bg-[var(--color-paper)]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </aside>
            </div>
          )}

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}