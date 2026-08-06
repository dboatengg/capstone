export default async function PropertiesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
  const properties = await res.json();

  return (
    <pre>{JSON.stringify(properties, null, 2)}</pre>
  );
}