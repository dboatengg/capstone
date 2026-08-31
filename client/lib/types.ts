export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
};

// Property listing data structure
export type Property = {
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
  images: string[];
};

// Inquiry on a property from a client
export type Inquiry = {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    location: string;
    agent: {
      id: string;
      name: string;
    };
  };
  client: {
    id: string;
    name: string;
    email: string;
  };
};

// Admin-accessible agent data
export type AdminAgent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  role: string;
  properties: { id: string }[];
  profileImage: string | null;
};

// Admin-accessible client data
export type AdminClient = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
};