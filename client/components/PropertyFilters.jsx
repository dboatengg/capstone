'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const search = formData.get('search')?.toString().trim();
    const minPrice = formData.get('minPrice')?.toString();
    const maxPrice = formData.get('maxPrice')?.toString();
    const bedrooms = formData.get('bedrooms')?.toString();
    const bathrooms = formData.get('bathrooms')?.toString();
    
    const params = new URLSearchParams();
    
    if (search) {
      params.set('search', search);
    }
    
    if (minPrice) {
      params.set('minPrice', minPrice);
    }
    
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    }

    if (bedrooms) {
        params.set('bedrooms', bedrooms);
    }
      
    if (bathrooms) {
        params.set('bathrooms', bathrooms);
    }

    const queryString = params.toString();

    router.push(
      queryString ? `/properties?${queryString}` : '/properties'
    );
  };

  const handleReset = () => {
    router.push('/properties');
  };

  return (
    <form key={searchParams.toString()} onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="search"
          placeholder="Search by title or location..."
          defaultValue={searchParams.get('search') || ''}
          className="w-full flex-1 rounded-lg border border-[var(--color-ink)]/15 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-ink)]/40 focus:ring-2 focus:ring-[var(--color-ink)]/5"
        />
        <div className="flex gap-3">
        <button type="submit" className="flex-1 sm:flex-none rounded-lg bg-[var(--color-ink)] px-6 py-3 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20 focus:ring-offset-2">
            Search
        </button>

        <button type="button" onClick={handleReset}
            className="flex-1 sm:flex-none rounded-lg border border-[var(--color-ink)]/15 bg-white px-6 py-3 font-medium text-[var(--color-ink)]/70 transition hover:border-[var(--color-ink)]/30 hover:bg-[var(--color-ink)]/[0.03] hover:text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/10 focus:ring-offset-2">
            Reset
        </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <input
            type="number"
            name="minPrice"
            placeholder="Minimum price"
            defaultValue={searchParams.get('minPrice') || ''}
            className="w-full rounded-lg border border-[var(--color-ink)]/15 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-ink)]/40 focus:ring-2 focus:ring-[var(--color-ink)]/5"
        />

        <input
            type="number"
            name="maxPrice"
            placeholder="Maximum price"
            defaultValue={searchParams.get('maxPrice') || ''}
            className="w-full rounded-lg border border-[var(--color-ink)]/15 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-ink)]/40 focus:ring-2 focus:ring-[var(--color-ink)]/5"
        />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <input
                type="number"
                name="bedrooms"
                min="0"
                placeholder="Number of bedrooms"
                defaultValue={searchParams.get('bedrooms') || ''}
                className="w-full rounded-lg border border-[var(--color-ink)]/15 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-ink)]/40 focus:ring-2 focus:ring-[var(--color-ink)]/5"
            />

            <input
                type="number"
                name="bathrooms"
                min="0"
                placeholder="Number of bathrooms"
                defaultValue={searchParams.get('bathrooms') || ''}
                className="w-full rounded-lg border border-[var(--color-ink)]/15 bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-ink)]/40 focus:ring-2 focus:ring-[var(--color-ink)]/5"/>
        </div>
    </form>
  );
}