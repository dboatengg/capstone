import prisma from '../db/prisma.js';
import bcrypt from 'bcrypt';


async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const agent = await prisma.agent.create({
    data: {
      name: 'Ama Boateng',
      email: 'ama@capstone.com',
      password: hashedPassword,
      phone: '+233201234567',
      whatsapp: '+233201234567',
    },
  });

  await prisma.property.createMany({
    data: [
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
        agentId: agent.id,
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
        agentId: agent.id,
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
        agentId: agent.id,
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
        agentId: agent.id,
      },
    ],
  });

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
