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
  const [isMounted, setIsMounted] = useState(false);

  function openSidebar() {
    // Mount it first, off-screen (isSidebarOpen still false at this instant).
    setIsMounted(true);
    // Wait one animation frame so the browser actually paints that off-screen
    // position before we flip isSidebarOpen — otherwise both changes would
    // land in the same paint and there'd be nothing to visually transition FROM.
    requestAnimationFrame(() => setIsSidebarOpen(true));
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
    // Let the 200ms slide-out transition finish before removing it from the DOM.
    setTimeout(() => setIsMounted(false), 200);
  }

  return (
    <RequireAuth allowedTypes={['agent']}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="md:hidden flex items-center justify-between mb-6">
          <span className="font-display text-lg text-[var(--color-ink)]">Dashboard</span>
          <button
            onClick={openSidebar}
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

          {isMounted && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div
                onClick={closeSidebar}
                className={`fixed inset-0 bg-black/40 transition-opacity duration-200 ${
                  isSidebarOpen ? 'opacity-100' : 'opacity-0'
                }`}
              />

              <aside
                className={`relative w-64 bg-white h-full p-6 flex flex-col gap-1 shadow-lg transition-transform duration-200 ease-out ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-lg text-[var(--color-ink)]">Menu</span>
                  <button onClick={closeSidebar} aria-label="Close menu" className="p-1">
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
                      onClick={closeSidebar}
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