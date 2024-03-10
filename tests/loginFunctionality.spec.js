import { expect, test } from '@playwright/test'

import { LoginPage } from './POM/login-page.js'

import { DashboardPage } from './POM/dashboard-page.js'

let loginPage
let dashboardPage
const dashboardURL = 'https://dulcet-belekoy-b337cc.netlify.app/' // URL for the home page, used for assertions once logged in
const loginURL = 'https://dulcet-belekoy-b337cc.netlify.app/login' // URL for the login page, used for assertions

// Setup to open loginPage
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  dashboardPage = new DashboardPage(page)
  await page.goto(loginURL)
  await expect(page).toHaveTitle('YAGRO - Log in') // Assertion to ensure we are on the correct page
})

// Validate logging into the Application using valid credentials
test('validCredentialsBoth', async ({ page }) => {
  await loginPage.loggingIn('qa', 'test')
  await expect(page).toHaveURL(dashboardURL)
  await expect(page).toHaveTitle('YAGRO - Dashboard')
})

// Validate logging into the Application using invalid credentials (i.e. Invalid email address and Invalid Password)
test('invalidCredentialsBoth', async ({ page }) => {
  await loginPage.loggingIn('invalid', 'invalid')
  await expect(loginPage.failedLoginMessage).toBeVisible() // Assertion to ensure the failed login message is visible
  await expect(page).toHaveURL(loginURL)
  await expect(page).toHaveTitle('YAGRO - Log in')
})

// Validate logging into the Application using invalid email address and valid Password
test('invalidCredentialsEmail', async ({ page }) => {
  await loginPage.loggingIn('invalid', 'test')
  await expect(loginPage.failedLoginMessage).toBeVisible()
  await expect(page).toHaveURL(loginURL)
  await expect(page).toHaveTitle('YAGRO - Log in')
})

// Validate logging into the Application using valid email address and invalid Password
test('invalidCredentialsPassword', async ({ page }) => {
  await loginPage.loggingIn('qa', 'invalid')
  await expect(loginPage.failedLoginMessage).toBeVisible()
  await expect(page).toHaveURL(loginURL)
  await expect(page).toHaveTitle('YAGRO - Log in')
})

// Validate logging into the Application using no credentials
test('noCredentials', async ({ page }) => {
  await loginPage.loggingIn('', '')
  await expect(loginPage.failedLoginMessage).toBeVisible()
  await expect(page).toHaveURL(loginURL)
  await expect(page).toHaveTitle('YAGRO - Log in')
})

// Validate logging into the application adding trailing spaces to the email
test('emptySpacesEmail', async ({ page }) => {
  await loginPage.loggingIn('qa    ', 'test')
  await expect(page).toHaveURL(dashboardURL)
  await expect(page).toHaveTitle('YAGRO - Dashboard')
})

// Basic accessibility test for the login page, using Tab and Enter to navigate and submit the form
test('accessibilityTest', async ({ page }) => {
  await loginPage.emailField.fill('qa')
  await page.keyboard.press('Tab')
  await loginPage.passwordField.fill('test')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(page).toHaveTitle('YAGRO - Dashboard')
  await expect(page).toHaveURL(dashboardURL)
})

// Validate correct placeholder text for the email and password fields
test('placeholderText', async () => {
  await expect(loginPage.emailField).toHaveAttribute('placeholder', 'Email')
  await expect(loginPage.passwordField).toHaveAttribute('placeholder', 'Password')
})

// Validate Logging into the Application and browsing back using Browser back button
test('browseBackAfterLoggingIn', async ({ page }) => {
  await loginPage.loggingIn('qa', 'test')
  await expect(page).toHaveTitle('YAGRO - Dashboard')
  await page.goBack()
  await expect(page).toHaveTitle('YAGRO - Dashboard')
  await expect(page).toHaveURL(dashboardURL)
})

test.describe('Session management tests', () => {
  // Validate Logging out from the Application and browsing back using Browser back button
  test('browseBackAfterLoggingOut', async ({ page }) => {
    await loginPage.loggingIn('qa', 'test')
    await expect(page).toHaveTitle('YAGRO - Dashboard')
    await expect(page).toHaveURL(dashboardURL)
    const isMobileViewport = page.viewportSize().width < 1024 // Checks if the viewport is mobile to locate the hamburger button on the dashboard
    const isHamburgerButtonVisible = isMobileViewport ? await dashboardPage.burgerButton.isVisible() : false
    if (isHamburgerButtonVisible)
      await dashboardPage.burgerButton.click()
    await dashboardPage.logOutButton.click()
    await expect(page).toHaveTitle('YAGRO - Log in')
    await page.goBack()
    await expect(page).toHaveTitle('YAGRO - Log in')
  })

  // Validate Logging out and trying to reach dashboard URL using direct URL
  test('directURLAfterLoggingOut', async ({ page }) => {
    await loginPage.loggingIn('qa', 'test')
    await expect(page).toHaveTitle('YAGRO - Dashboard')
    await expect(page).toHaveURL(dashboardURL)
    const isMobileViewport = page.viewportSize().width < 1024 // Checks if the viewport is mobile to locate the hamburger button on the dashboard
    const isHamburgerButtonVisible = isMobileViewport ? await dashboardPage.burgerButton.isVisible() : false
    if (isHamburgerButtonVisible)
      await dashboardPage.burgerButton.click()
    await dashboardPage.logOutButton.click()
    await page.goto(dashboardURL)
    await expect(page).toHaveTitle('YAGRO - Log in')
    await expect(page).toHaveURL(loginURL)
  })
})

// Validate the text into the Password field is toggled to hide its visibility
test('passwordFieldVisibility', async () => {
  await loginPage.passwordField.fill('test')
  await expect(loginPage.passwordField).toHaveAttribute('type', 'password')
})

// Validate the copying of the text entered into the Password field
test('passwordFieldCopy', async ({ page }) => {
  await loginPage.passwordField.fill('test')
  await loginPage.passwordField.focus()
  await page.keyboard.press('Control+KeyA')
  await page.keyboard.press('Control+KeyC')
  await loginPage.emailField.focus()
  await page.keyboard.press('Control+KeyV')
  await expect(loginPage.emailField).not.toHaveText('test')
})

// Validate Logging into the Application, closing the Browser without logging out and opening the application in the Browser again
test('closeBrowserAfterLoggingIn', async ({ page, context }) => {
  await loginPage.loggingIn('qa', 'test')
  await expect(page).toHaveTitle('YAGRO - Dashboard')
  await page.close()
  const newPage = await context.newPage()
  await newPage.goto(dashboardURL)
  await expect(newPage).toHaveTitle('YAGRO - Dashboard')
  await expect(newPage).toHaveURL(dashboardURL)
})

// Validate SQL injection attacks on the login functionality
test('sqlInjectionAttacks', async ({ context }) => {
  // SQL injection payloads for email and password fields
  const sqlInjectionQueries = [
    // Standard SQL injection payload
    { email: '\' OR \'1\'=\'1\'', password: '\' OR \'1\'=\'1\'' },
    // Payload attempting to bypass authentication with empty credentials
    { email: '\' OR \'\'=\'\'', password: '\' OR \'\'=\'\'' },
    // Payload attempting to retrieve all user records
    { email: '\' OR 1=1 --', password: '\' OR 1=1 --' },
    // Payload attempting to log in as the first user in the database
    { email: '\' OR id=1 --', password: '\' OR id=1 --' },
    // Payload attempting to log in with a blank password
    { email: '\' OR email=\'test@test.com\' --', password: '\'\'' },
    // Payload attempting to log in with a blank email
    { email: '\'\'', password: '\' OR password=\'password\' --' },
    // Attempt to bypass authentication using a UNION SELECT statement
    { email: '\' UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL--', password: '\'\'' },
    // Attempt to retrieve all users' credentials using a UNION SELECT statement
    { email: '\' UNION SELECT email, password, \'\', \'\', \'\', \'\' FROM users--', password: '\'\'' },
    // Attempt to drop the users table using a DROP TABLE statement
    { email: '\'; DROP TABLE users--', password: '\'\'' },
  ]

  for (const { email, password } of sqlInjectionQueries) {
    const page = await context.newPage()
    const loginPage = new LoginPage(page) // Bypasses the beforeEach setup
    await page.goto(loginURL)
    await expect(page).toHaveTitle('YAGRO - Log in')
    await loginPage.loggingIn(email, password)
    await expect(loginPage.failedLoginMessage).toBeVisible()
    await expect(page).toHaveURL(loginURL)
    await expect(page).toHaveTitle('YAGRO - Log in')
    await page.close()
  }
})
