'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [userType, setUserType] = useState<'agent' | 'client'>('agent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/auth/${userType}/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const user = userType === 'agent' ? data.agent : data.client;
      login({ ...user, userType }, data.token);
      router.push(userType === 'agent' ? '/dashboard' : '/properties');

    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-[var(--color-ink)] mb-8">Log in</h1>

      {/* Agent/Client toggle */}
      <div className="flex border border-[var(--color-stone-line)] mb-6">
        <button
          type="button"
          onClick={() => setUserType('agent')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            userType === 'agent'
              ? 'bg-[var(--color-forest)] text-white'
              : 'bg-white text-[var(--color-ink)]/60'
          }`}
        >
          Agent
        </button>
        <button
          type="button"
          onClick={() => setUserType('client')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            userType === 'client'
              ? 'bg-[var(--color-forest)] text-white'
              : 'bg-white text-[var(--color-ink)]/60'
          }`}
        >
          Client
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        {error && <p className="text-sm text-[var(--color-clay)]">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--color-forest)] text-white text-sm font-medium py-3 hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : `Log in as ${userType}`}
        </button>
      </form>
      <p className="text-sm text-[var(--color-ink)]/60 text-center mt-6"> Don&apos;t have an account?{' '}
      <Link href="/register" className="text-[var(--color-forest)] font-medium hover:underline">
      Sign up
      </Link>
      </p>
    </div>
  );
}