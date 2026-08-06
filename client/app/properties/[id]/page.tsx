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

async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`);

    if (!res.ok) {
      console.error('Failed to fetch property:', res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Network error fetching property:', error);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div>
        <h1>Property not found</h1>
        <p>This property may have been removed or the link is incorrect.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.longDescription}</p>
      <p>GHS {property.price.toLocaleString()}</p>
      <p>{property.bedrooms} bed · {property.bathrooms} bath</p>
      <p>{property.location}</p>
      <p>Status: {property.available ? 'Available' : 'Unavailable'}</p>
      <hr />
      <h2>Listed by {property.agent.name}</h2>
      <p>{property.agent.email}</p>
      {property.agent.phone && <p>Phone: {property.agent.phone}</p>}
      {property.agent.whatsapp && <p>WhatsApp: {property.agent.whatsapp}</p>}
    </div>
  );
}