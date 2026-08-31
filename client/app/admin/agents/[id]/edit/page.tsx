'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAgent, updateAgent, uploadAgentProfileImage } from '@/lib/api';
import AvatarUpload from '@/components/AvatarUpload';

export default function AdminEditAgentPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [role, setRole] = useState('agent');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    getAgent(params.id, token).then((agent) => {
      if (!agent) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setName(agent.name);
      setEmail(agent.email);
      setPhone(agent.phone ?? '');
      setWhatsapp(agent.whatsapp ?? '');
      setRole(agent.role);
      setProfileImage(agent.profileImage ?? null);
      setIsLoading(false);
    });
  }, [params.id, token]);

  async function handleAvatarUpload(file: File) {
    const result = await uploadAgentProfileImage(params.id, file, token!);
    if (result.success) {
      setProfileImage(result.profileImage);
    } else {
      setError(result.error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await updateAgent(
      params.id,
      {
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        role,
      },
      token!
    );

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/agents');
  }

  if (isLoading) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>;
  }

  if (notFound) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Agent not found.</p>;
  }

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl text-[var(--color-ink)] mb-6">Edit agent</h1>

      <div className="mb-6">
        <AvatarUpload currentImage={profileImage} name={name} onUpload={handleAvatarUpload} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

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
          <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)] bg-white"
          >
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="text-sm text-[var(--color-clay)]">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--color-forest)] text-white text-sm font-medium py-3 hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}