'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProperty, updateProperty, getAgents } from '@/lib/api';
import { AdminAgent } from '@/lib/types';

export default function AdminEditPropertyPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [agents, setAgents] = useState<AdminAgent[]>([]);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'sale' | 'rent'>('sale');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [location, setLocation] = useState('');
  const [available, setAvailable] = useState(true);
  const [agentId, setAgentId] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    Promise.all([getProperty(params.id), getAgents(token)]).then(([property, agentList]) => {
      if (!property) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setTitle(property.title);
      setShortDescription(property.shortDescription);
      setLongDescription(property.longDescription);
      setPrice(String(property.price));
      setType(property.type as 'sale' | 'rent');
      setBedrooms(String(property.bedrooms));
      setBathrooms(String(property.bathrooms));
      setLocation(property.location);
      setAvailable(property.available);
      setAgentId(property.agent.id);
      setAgents(agentList ?? []);
      setIsLoading(false);
    });
  }, [params.id, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await updateProperty(
      params.id,
      {
        title,
        shortDescription,
        longDescription,
        price: parseFloat(price),
        type,
        bedrooms: parseInt(bedrooms, 10),
        bathrooms: parseInt(bathrooms, 10),
        location,
        available,
        agentId,
      },
      token!
    );

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(`/properties/${params.id}?from=admin`);
  }

  if (isLoading) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>;
  }

  if (notFound) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Property not found.</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-[var(--color-ink)] mb-6">Edit property (admin)</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="agentId" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Assigned agent
          </label>
          <select
            id="agentId"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)] bg-white"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Short description
          </label>
          <input
            id="shortDescription"
            type="text"
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div>
          <label htmlFor="longDescription" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Full description
          </label>
          <textarea
            id="longDescription"
            required
            rows={4}
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
              Price (GHS)
            </label>
            <input
              id="price"
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
              Listing type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'sale' | 'rent')}
              className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)] bg-white"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
              Bedrooms
            </label>
            <input
              id="bedrooms"
              type="number"
              required
              min="0"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
              Bathrooms
            </label>
            <input
              id="bathrooms"
              type="number"
              required
              min="0"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]/70">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          Available now
        </label>

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