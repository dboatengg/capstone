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

    if (search) params.set('search', search);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (bathrooms) params.set('bathrooms', bathrooms);

    const queryString = params.toString();

    router.push(
      queryString ? `/properties?${queryString}` : '/properties'
    );
  };

  const handleReset = () => {
    router.push('/properties');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* We'll build the fields here next */}
    </form>
  );
}