import { Page } from '@playwright/test'

export const TEST_USERS = {
  admin: { email: 'admin@test.com', password: 'password123', userType: 'agent' as const },
  agent: { email: 'agent1@test.com', password: 'password123', userType: 'agent' as const },
  client: { email: 'client1@test.com', password: 'password123', userType: 'client' as const },
}

type TestUser = (typeof TEST_USERS)[keyof typeof TEST_USERS]

export async function login(page: Page, user: TestUser) {
  await page.addInitScript(() => {
    sessionStorage.setItem('coldStartNoticeSeen', 'true')
  })

  await page.goto('/login')

  if (user.userType === 'client') {
    await page.getByRole('button', { name: 'Client' }).click()
  }

  await page.locator('#email').fill(user.email)
  await page.locator('#password').fill(user.password)
  await page.getByRole('button', { name: `Log in as ${user.userType}` }).click()
}
