import { Property, Inquiry } from './types';

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

type CreatePropertyInput = {
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  available: boolean;
};

export async function createProperty(
  input: CreatePropertyInput,
  token: string
): Promise<{ success: true; property: Property } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.errors?.[0]?.message || data.error || 'Failed to create property';
      return { success: false, error: message };
    }

    return { success: true, property: data };
  } catch (err) {
    console.error('Network error creating property:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function createInquiry(
  propertyId: string,
  message: string,
  token: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ propertyId, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.errors?.[0]?.message || data.error || 'Failed to send inquiry';
      return { success: false, error: message };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error creating inquiry:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function getInquiries(token: string): Promise<Inquiry[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('Failed to fetch inquiries:', res.status);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error('Network error fetching inquiries:', err);
    return null;
  }
}

// 
export async function updateInquiryStatus(
  id: string,
  status: string,
  token: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.errors?.[0]?.message || data.error || 'Failed to update status';
      return { success: false, error: message };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error updating inquiry status:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}