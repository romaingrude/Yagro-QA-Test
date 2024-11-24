export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page
    this.emailField = page.locator('#emailInput')
    this.passwordField = page.locator('#passwordInput')
    this.logInButtonSubmit = page.getByRole('button', { name: 'Log in' })
    this.failedLoginMessage = page.getByText('Login Failed').first()
  }

  async clickLogInButton() {
    await this.logInButtonSubmit.click()
  }

  async fillFields(email, password) {
    await this.emailField.fill(email)
    await this.passwordField.fill(password)
  }

  async loggingIn(email, password) {
    await this.fillFields(email, password)
    await this.clickLogInButton()
  }
}
