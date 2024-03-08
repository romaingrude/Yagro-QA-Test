import { expect, test } from '@playwright/test'

test('Go to Login Screen', async ({ page }) => {
  await page.goto('https://dulcet-belekoy-b337cc.netlify.app/login')

  await expect(page.locator('#title')).toContainText('Log in to YAGRO - Demo')
})
