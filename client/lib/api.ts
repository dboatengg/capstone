import { Property, Inquiry, AdminAgent } from './types'

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
  agentId?: string;
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

// 
export async function getAgents(token: string): Promise<AdminAgent[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('Failed to fetch agents:', res.status);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error('Network error fetching agents:', err);
    return null;
  }
}

export async function deleteAgent(
  id: string,
  token: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Failed to delete agent' };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error deleting agent:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

import { AdminClient } from './types';

export async function getClients(token: string): Promise<AdminClient[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('Failed to fetch clients:', res.status);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error('Network error fetching clients:', err);
    return null;
  }
}

export async function deleteClient(
  id: string,
  token: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Failed to delete client' };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error deleting client:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}


export async function deleteInquiry(
  id: string,
  token: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Failed to delete inquiry' };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error deleting inquiry:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}


type UpdateAgentInput = {
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  role: string;
};

export async function updateAgent(
  id: string,
  input: UpdateAgentInput,
  token: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.errors?.[0]?.message || data.error || 'Failed to update agent';
      return { success: false, error: message };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error updating agent:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

type UpdateClientInput = {
  name: string;
  email: string;
  phone: string | null;
};

export async function updateClient(
  id: string,
  input: UpdateClientInput,
  token: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.errors?.[0]?.message || data.error || 'Failed to update client';
      return { success: false, error: message };
    }

    return { success: true };
  } catch (err) {
    console.error('Network error updating client:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}


export async function getAgent(id: string, token: string): Promise<AdminAgent | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error('Network error fetching agent:', err);
    return null;
  }
}

export async function getClient(id: string, token: string): Promise<AdminClient | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error('Network error fetching client:', err);
    return null;
  }
}

export async function uploadPropertyImages(
  id: string,
  files: File[],
  token: string
): Promise<{ success: true; property: Property } | { success: false; error: string }> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to upload images' };
    }

    return { success: true, property: data };
  } catch (err) {
    console.error('Network error uploading images:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function deletePropertyImage(
  id: string,
  imageUrl: string,
  token: string
): Promise<{ success: true; property: Property } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}/images`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to delete image' };
    }

    return { success: true, property: data };
  } catch (err) {
    console.error('Network error deleting image:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function reorderPropertyImages(
  id: string,
  images: string[],
  token: string
): Promise<{ success: true; property: Property } | { success: false; error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}/images/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ images }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to reorder images' };
    }

    return { success: true, property: data };
  } catch (err) {
    console.error('Network error reordering images:', err);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}