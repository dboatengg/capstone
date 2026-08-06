import Link from 'next/link';
import { getProperties } from '@/lib/api';

export default async function PropertiesPage() {
  const properties = await getProperties();

  if (!properties) {
    return (
      <div>
        <h1>Properties</h1>
        <p>Something went wrong loading properties. Please try again later.</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div>
        <h1>Properties</h1>
        <p>No properties available right now.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <h2>
              <Link href={`/properties/${property.id}`}>{property.title}</Link>
            </h2>
            <p>{property.shortDescription}</p>
            <p>GHS {property.price.toLocaleString()}</p>
            <p>{property.bedrooms} bed · {property.bathrooms} bath</p>
            <p>{property.location}</p>
            <p>Listed by {property.agent.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}