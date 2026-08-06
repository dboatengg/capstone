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

export default async function PropertiesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
  const properties: Property[] = await res.json();

  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <h2>{property.title}</h2>
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