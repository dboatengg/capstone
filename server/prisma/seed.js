import prisma from '../db/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const ama = await prisma.agent.upsert({
    where: { email: 'ama@capstone.com' },
    update: {},
    create: {
      name: 'Ama Boateng',
      email: 'ama@capstone.com',
      password: hashedPassword,
      phone: '+233201234567',
      whatsapp: '+233201234567',
    },
  });

  const kwame = await prisma.agent.upsert({
    where: { email: 'kwame@capstone.com' },
    update: {},
    create: {
      name: 'Kwame Owusu',
      email: 'kwame@capstone.com',
      password: hashedPassword,
      phone: '+233209876543',
      whatsapp: '+233209876543',
    },
  });

  const abena = await prisma.agent.upsert({
    where: { email: 'abena@capstone.com' },
    update: {},
    create: {
      name: 'Abena Asante',
      email: 'abena@capstone.com',
      password: hashedPassword,
      phone: '+233245551234',
      whatsapp: null,
    },
  });

  const properties = [
    {
      title: 'Modern Apartment in East Legon',
      shortDescription: 'A beautiful 3 bedroom apartment in East Legon',
      longDescription: 'This stunning modern apartment is located in the heart of East Legon, Accra. It features 3 spacious bedrooms, 2 bathrooms, and a large living area with breathtaking city views.',
      price: 230000,
      type: 'sale',
      available: true,
      bedrooms: 3,
      bathrooms: 2,
      location: 'East Legon, Accra',
      agentId: ama.id,
    },
    {
      title: 'Cozy 2-Bed in Kumasi Ridge',
      shortDescription: 'Quiet, leafy neighborhood close to the city center',
      longDescription: 'A comfortable 2 bedroom home tucked away in the Ridge area of Kumasi, known for its tree-lined streets and proximity to major amenities.',
      price: 1800,
      type: 'rent',
      available: true,
      bedrooms: 2,
      bathrooms: 1,
      location: 'Ridge, Kumasi',
      agentId: ama.id,
    },
    {
      title: 'Luxury Villa in Trasacco Valley',
      shortDescription: '5 bedroom villa with pool and garden',
      longDescription: 'An expansive luxury villa in the gated Trasacco Valley community, featuring a private pool, landscaped garden, and 24-hour security.',
      price: 850000,
      type: 'sale',
      available: false,
      bedrooms: 5,
      bathrooms: 5,
      location: 'Trasacco Valley, Accra',
      agentId: ama.id,
    },
    {
      title: 'Studio Apartment in Adum',
      shortDescription: 'Compact and affordable, walking distance to Kejetia',
      longDescription: 'A well-maintained studio apartment in the busy Adum area, perfect for young professionals working in central Kumasi.',
      price: 900,
      type: 'rent',
      available: true,
      bedrooms: 1,
      bathrooms: 1,
      location: 'Adum, Kumasi',
      agentId: ama.id,
    },
    {
      title: 'Family Home in Airport Residential',
      shortDescription: 'Spacious 4-bedroom home in a prestigious neighborhood',
      longDescription: 'This elegant family home sits in the highly sought-after Airport Residential Area, close to embassies, international schools, and fine dining. Features a large compound and dedicated staff quarters.',
      price: 620000,
      type: 'sale',
      available: true,
      bedrooms: 4,
      bathrooms: 4,
      location: 'Airport Residential, Accra',
      agentId: kwame.id,
    },
    {
      title: 'Shared Compound House in Ahodwo',
      shortDescription: 'Affordable 1-bedroom unit in a secure compound',
      longDescription: 'A modest, well-kept 1-bedroom unit within a secure shared compound in Ahodwo, Kumasi. Ideal for students or single professionals seeking an affordable base close to KNUST.',
      price: 700,
      type: 'rent',
      available: true,
      bedrooms: 1,
      bathrooms: 1,
      location: 'Ahodwo, Kumasi',
      agentId: kwame.id,
    },
    {
      title: 'Executive Townhouse in Cantonments',
      shortDescription: '3-bedroom townhouse with rooftop terrace',
      longDescription: 'A sleek, modern townhouse in Cantonments featuring an open-plan living area, private rooftop terrace, and secure parking for two vehicles.',
      price: 3200,
      type: 'rent',
      available: true,
      bedrooms: 3,
      bathrooms: 3,
      location: 'Cantonments, Accra',
      agentId: kwame.id,
    },
    {
      title: 'Bungalow in Nhyiaeso',
      shortDescription: 'Charming 2-bedroom bungalow in a peaceful setting',
      longDescription: 'A well-maintained bungalow in the quiet Nhyiaeso neighborhood of Kumasi, offering a private garden and easy access to the city center.',
      price: 195000,
      type: 'sale',
      available: true,
      bedrooms: 2,
      bathrooms: 2,
      location: 'Nhyiaeso, Kumasi',
      agentId: abena.id,
    },
    {
      title: 'Penthouse in Airport City',
      shortDescription: 'Top-floor 3-bedroom penthouse with skyline views',
      longDescription: 'An impressive penthouse unit in Airport City, offering panoramic views of Accra, premium finishes, and access to a shared gym and pool.',
      price: 4500,
      type: 'rent',
      available: false,
      bedrooms: 3,
      bathrooms: 3,
      location: 'Airport City, Accra',
      agentId: abena.id,
    },
  ];

  for (const property of properties) {
    const existing = await prisma.property.findFirst({
      where: { title: property.title, agentId: property.agentId },
    });

    if (!existing) {
      await prisma.property.create({ data: property });
    }
  }

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });