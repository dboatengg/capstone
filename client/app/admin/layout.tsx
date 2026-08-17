'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';

const TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/properties', label: 'Properties' },
  { href: '/admin/agents', label: 'Agents' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/inquiries', label: 'Inquiries' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <RequireAuth allowedTypes={['agent']} requireRole="admin">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-display text-3xl sm:text-4xl mb-8">Admin</h1>

        <div className="flex gap-1 border-b border-[var(--color-stone-line)] mb-8 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`shrink-0 px-3 sm:px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[var(--color-forest)] text-[var(--color-forest)]'
                    : 'border-transparent text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {children}
      </div>
    </RequireAuth>
  );
}