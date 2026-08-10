'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createProperty } from '@/lib/api';

export default function NewPropertyPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'sale' | 'rent'>('sale');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [location, setLocation] = useState('');
  const [available, setAvailable] = useState(true);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard: only logged-in agents belong here
  if (!user || user.userType !== 'agent') {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-[var(--color-ink)] mb-2">Agents only</h1>
        <p className="text-[var(--color-ink)]/60">
          You need to be logged in as an agent to list a property.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await createProperty(
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
      },
      token!
    );

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(`/properties/${result.property.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-[var(--color-ink)] mb-8">List a property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="e.g. East Legon, Accra"
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
          {isSubmitting ? 'Creating listing...' : 'Create listing'}
        </button>
      </form>
    </div>
  );
}