export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
};

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
};

export type Inquiry = {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    location: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
  };
};

export type AdminAgent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  role: string;
  properties: { id: string }[];
};