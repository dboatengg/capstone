import { test, expect } from '@playwright/test'
import { login, TEST_USERS } from './helpers'

test.describe('admin dashboard flow', () => {
  test('admin can view platform overview stats', async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await expect(page).toHaveURL('/admin')

    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible()
    await expect(page.getByText('Properties').first()).toBeVisible()
    await expect(page.getByText('Agents').first()).toBeVisible()
    await expect(page.getByText('Clients').first()).toBeVisible()
    await expect(page.getByText('Inquiries').first()).toBeVisible()

    // Seeded test data: 2 properties, 3 agents, 1 client, 0 inquiries
    await expect(page.locator('text=Properties').locator('..').getByText('2')).toBeVisible()
    await expect(page.locator('text=Agents').locator('..').getByText('3')).toBeVisible()
    await expect(page.locator('text=Clients').locator('..').getByText('1')).toBeVisible()
  })
})
