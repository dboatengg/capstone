import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import prisma from '../../db/prisma.js'
import { api } from '../helpers/request.js'
import { resetDatabase, seedTestData, disconnectDatabase } from '../helpers/db.js'

describe('GET /api/properties filters', () => {
  let fixtures

  beforeAll(async () => {
    await resetDatabase()
  })

  beforeEach(async () => {
    await resetDatabase()
    fixtures = await seedTestData()

    await prisma.property.createMany({
      data: [
        {
          title: 'Budget Studio in Accra',
          shortDescription: 'Affordable studio',
          longDescription: 'Compact studio apartment',
          price: 50000,
          type: 'rent',
          bedrooms: 1,
          bathrooms: 1,
          location: 'Osu, Accra',
          agentId: fixtures.agent1.id,
        },
        {
          title: 'Luxury Villa in Accra',
          shortDescription: 'High-end villa',
          longDescription: 'Spacious luxury villa',
          price: 500000,
          type: 'sale',
          bedrooms: 5,
          bathrooms: 4,
          location: 'East Legon, Accra',
          agentId: fixtures.agent1.id,
        },
        {
          title: 'Family Home in Kumasi',
          shortDescription: 'Mid-range family home',
          longDescription: 'Comfortable family home',
          price: 150000,
          type: 'sale',
          bedrooms: 3,
          bathrooms: 2,
          location: 'Nhyiaeso, Kumasi',
          agentId: fixtures.agent2.id,
        },
      ],
    })
  })

  afterAll(async () => {
    await resetDatabase()
    await disconnectDatabase()
  })

  it('returns all properties with no filters', async () => {
    const res = await api().get('/api/properties')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(5)
  })

  it('filters by search term in title', async () => {
    const res = await api().get('/api/properties').query({ search: 'Luxury' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('Luxury Villa in Accra')
  })

  it('filters by search term in location', async () => {
    const res = await api().get('/api/properties').query({ search: 'kumasi' })

    expect(res.status).toBe(200)
    expect(res.body.map((p) => p.title)).toEqual(
      expect.arrayContaining(['Agent Two Listing', 'Family Home in Kumasi'])
    )
  })

  it('filters by minimum price', async () => {
    const res = await api().get('/api/properties').query({ minPrice: 200000 })

    expect(res.status).toBe(200)
    expect(res.body.every((p) => p.price >= 200000)).toBe(true)
    expect(res.body.map((p) => p.title)).toEqual(
      expect.arrayContaining(['Luxury Villa in Accra'])
    )
  })

  it('filters by maximum price', async () => {
    const res = await api().get('/api/properties').query({ maxPrice: 100000 })

    expect(res.status).toBe(200)
    expect(res.body.every((p) => p.price <= 100000)).toBe(true)
  })

  it('filters by price range', async () => {
    const res = await api()
      .get('/api/properties')
      .query({ minPrice: 100000, maxPrice: 200000 })

    expect(res.status).toBe(200)
    expect(res.body.every((p) => p.price >= 100000 && p.price <= 200000)).toBe(true)
    expect(res.body.map((p) => p.title)).toEqual(
      expect.arrayContaining(['Agent One Listing', 'Agent Two Listing', 'Family Home in Kumasi'])
    )
  })

  it('filters by bedroom count', async () => {
    const res = await api().get('/api/properties').query({ bedrooms: 3 })

    expect(res.status).toBe(200)
    expect(res.body.every((p) => p.bedrooms === 3)).toBe(true)
    expect(res.body).toHaveLength(2)
  })

  it('filters by bathroom count', async () => {
    const res = await api().get('/api/properties').query({ bathrooms: 1 })

    expect(res.status).toBe(200)
    expect(res.body.every((p) => p.bathrooms === 1)).toBe(true)
  })

  it('combines multiple filters', async () => {
    const res = await api()
      .get('/api/properties')
      .query({ search: 'Accra', minPrice: 40000, maxPrice: 100000, bedrooms: 1 })

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('Budget Studio in Accra')
  })

  it('returns empty array when nothing matches', async () => {
    const res = await api()
      .get('/api/properties')
      .query({ search: 'Nonexistent Place XYZ' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(0)
  })
})
