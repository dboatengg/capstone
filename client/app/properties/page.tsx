import Link from 'next/link';

type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
};

type Property = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  type: string;
  available: boolean;
  bedrooms: number;
  bathrooms: number;
  location: string;
  createdAt: string;
  updatedAt: string;
  agent: Agent;
};

async function getProperties(): Promise<Property[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`);

    if (!res.ok) {
      console.error('Failed to fetch properties:', res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Network error fetching properties:', error);
    return null;
  }
}

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
            <Link href={`/properties/${property.id}`}>{property.title}</Link>
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