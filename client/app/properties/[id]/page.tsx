import { getProperty } from '@/lib/api';

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