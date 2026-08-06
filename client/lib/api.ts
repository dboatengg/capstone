import { Property } from './types';

export async function getProperties(): Promise<Property[] | null> {
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

export async function getProperty(id: string): Promise<Property | null> {
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