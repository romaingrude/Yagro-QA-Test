import {} from '@playwright/test'

// Clears cookies if needed for testing state transitions or other cookie related tests
export async function clearCookies({ context }) {
  await context.clearCookies()
}