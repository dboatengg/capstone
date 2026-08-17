'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Props = {
  children: React.ReactNode;
  allowedTypes?: ('agent' | 'client')[];
  requireRole?: string;
};

export default function RequireAuth({ children, allowedTypes, requireRole }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const isAllowed =
    user &&
    (!allowedTypes || allowedTypes.includes(user.userType)) &&
    (!requireRole || user.role === requireRole);

  useEffect(() => {
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');

    if (!user && !hasToken) {
      router.push('/login');
    } else if (user) {
      const typeOk = !allowedTypes || allowedTypes.includes(user.userType);
      const roleOk = !requireRole || user.role === requireRole;
      if (!typeOk || !roleOk) {
        router.push('/');
      }
    }
  }, [user, allowedTypes, requireRole, router]);

  if (!isAllowed) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-[var(--color-ink)]/60">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}