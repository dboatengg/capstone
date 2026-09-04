import { test, expect } from '@playwright/test'
import { login, TEST_USERS } from './helpers'

test.describe('client inquiry flow', () => {
  test('client can browse a property and submit an inquiry', async ({ page }) => {
    await login(page, TEST_USERS.client)
    await expect(page).toHaveURL('/home')

    await page.goto('/properties')
    await expect(page.getByRole('heading', { name: 'Properties' })).toBeVisible()

    await page.getByRole('link', { name: /Agent One Listing/i }).click()
    await expect(page.getByRole('heading', { name: 'Agent One Listing' })).toBeVisible()

    await page.locator('#message').fill('Is this property still available? I would like a viewing.')
    await page.getByRole('button', { name: 'Send inquiry' }).click()

    await expect(
      page.getByText('Your inquiry has been sent. The agent will get back to you soon.')
    ).toBeVisible()
  })
})
