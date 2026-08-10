'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Props = {
  children: React.ReactNode;
  allowedTypes?: ('agent' | 'client')[];
};

export default function RequireAuth({ children, allowedTypes }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const isAllowed = user && (!allowedTypes || allowedTypes.includes(user.userType));

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (allowedTypes && !allowedTypes.includes(user.userType)) {
      router.push('/');
    }
  }, [user, allowedTypes, router]);

  if (!isAllowed) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-[var(--color-ink)]/60">Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}