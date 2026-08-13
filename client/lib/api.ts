import { Property, Inquiry } from './types';

// export async function getProperties(): Promise<Property[] | null> {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
//       cache: 'no-store',
//     });

//     if (!res.ok) {
//       console.error('Failed to fetch properties:', res.status);
//       return null;
//     }

//     return res.json();
//   } catch (error) {
//     console.error('Network error fetching properties:', error);
//     return null;
//   }
// }

type PropertyFilters = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
};

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<Property[] | null> {
  try {
    const params = new URLSearchParams();

    if (filters.search) {
      params.set('search', filters.search);
    }

    if (filters.minPrice !== undefined) {
      params.set('minPrice', String(filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      params.set('maxPrice', String(filters.maxPrice));
    }

    if (filters.bedrooms !== undefined) {
      params.set('bedrooms', String(filters.bedrooms));
    }

    if (filters.bathrooms !== undefined) {
      params.set('bathrooms', String(filters.bathrooms));
    }

    const queryString = params.toString();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/properties${
      queryString ? `?${queryString}` : ''
    }`;

    const res = await fetch(url, {
      cache: 'no-store',
    });

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`, {
      cache: 'no-store',
    });

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

export async function deleteProperty(
  id: string,
  token: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Failed to delete property' };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error deleting property:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function updateProperty(
  id: string,
  input: CreatePropertyInput,
  token: string
): Promise<{ success: true; property: Property } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.errors?.[0]?.message || data.error || 'Failed to update property';
      return { success: false, error: message };
    }

    return { success: true, property: data };
  } catch (err) {
    console.error('Network error updating property:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}