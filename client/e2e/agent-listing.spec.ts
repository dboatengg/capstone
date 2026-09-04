import { test, expect } from '@playwright/test'
import { login, TEST_USERS } from './helpers'

test.describe('agent listing flow', () => {
  test('agent can create a new property listing', async ({ page }) => {
    const title = `E2E Test Listing ${Date.now()}`

    await login(page, TEST_USERS.agent)
    await expect(page).toHaveURL('/dashboard')

    await page.goto('/properties/new')
    await expect(page.getByRole('heading', { name: 'List a property' })).toBeVisible()

    await page.locator('#title').fill(title)
    await page.locator('#shortDescription').fill('A property created during E2E testing')
    await page.locator('#longDescription').fill('This listing was created by an automated Playwright test.')
    await page.locator('#price').fill('175000')
    await page.locator('#bedrooms').fill('2')
    await page.locator('#bathrooms').fill('1')
    await page.locator('#location').fill('Tema, Accra')
    await page.getByRole('button', { name: 'Create listing' }).click()

    await expect(page.getByRole('heading', { name: title })).toBeVisible()
    await expect(page.getByText('Tema, Accra')).toBeVisible()
  })
})
