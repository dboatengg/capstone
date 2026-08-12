import { getProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';

type SearchParams = {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
};

type PropertiesPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;

  const filters = {
    search: params.search || undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    bathrooms: params.bathrooms ? Number(params.bathrooms) : undefined,
  };

  const properties = await getProperties(filters);


  if (!properties) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-3xl mb-2">Properties</h1>
        <p className="text-[var(--color-clay)]">
          Something went wrong loading properties. Please try again later.
        </p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-3xl mb-2">Properties</h1>
        <p className="text-[var(--color-ink)]/60">No properties available right now.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}