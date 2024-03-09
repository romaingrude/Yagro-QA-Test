export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page
    this.logOutButton = page.getByRole('link', { name: 'Log out' })
    this.burgerButton = page.locator('button[class*=\'w-8\']')
  }
}
