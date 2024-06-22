
# QA Challenge

## 👨‍🔬 Challenge

For this challenge, we have created a 'bare bones' example of our platform using [Nuxt 3](https://nuxt.com/) / [Vue](https://vuejs.org/).

We would like you to create tests to improve the quality of this application. We are flexible with your approach and encourage you to use the tools you prefer. We have installed Playwright and set it up to work with this example to make life easier. 

### We would like you to create tests for the following:

- The login functionality.

### You can view the site here:
https://dulcet-belekoy-b337cc.netlify.app

### You can log in as a user with the following credentials:

| Email | Password |
| --- | --- |
| qa | test |

You will be able to log in and view:
---

You will need to have the following installed: 
- nodejs
- git

Before running the tests you will need to do yarn install or npm install.

/////////////////////////////////////////////////////////////////

## My tests

[PLEASE FIND THE EXCEL SHEET FOR THE TEST CASES HERE](https://docs.google.com/spreadsheets/d/1mMFTUP5dS-l-xut6XHZ_CyybHONYrW-yLzyCjKeH3zs/edit?usp=sharing)

After some initial exploratory testing, the observations and assumptions are:

- Current login credentials do not use email format, only for the purpose of this challenge. Therefore no testing related to the email format and email validation is performed
- Same error message for multiple scenarios where logging in fails due incorrect credentials
- No "Password forgotten" button/link
- No "Register/Sign Up" button/link
- No repeated unsuccessful login attempts prevention/message
- No "Account" tab with the possibility to modify current password or amend any account information

## Changes Made
List all the significant changes you've made in this pull request. Be specific and clear to make the review process easier.

### Added
- Login Functionality - Tests

### Modified
- Detail any modifications to existing files, tests, or features.

### Fixed
- Mention any bugs or issues you have resolved.

## Testing Strategy
Describe the testing strategy you employed. Include:

- **Test Cases:** List the test cases you have written or modified.
// Validate logging into the Application using valid credentials
// Validate logging into the Application using invalid credentials (i.e. Invalid email address and Invalid Password)
// Validate logging into the Application using invalid email address and valid Password
// Validate logging into the Application using valid email address and invalid Password
// Validate logging into the Application using no credentials
// Validate logging into the application adding trailing spaces to the email
// Basic accessibility test for the login page, using Tab and Enter to navigate and submit the form
// Validate correct placeholder text for the email and password fields
// Validate Logging into the Application and browsing back using Browser back button
// Validate Logging out from the Application and browsing back using Browser back button
// Validate Logging out and trying to reach dashboard URL using direct URL
// Validate the text into the Password field is toggled to hide its visibility
// Validate the copying of the text entered into the Password field
// Validate Logging into the Application, closing the Browser without logging out and opening the application in the Browser again
// Validate SQL injection attacks on the login functionality

- **Test Coverage:** Indicate the areas of the application that are covered by your tests.
Log In page and "Log Out" button from the dashboard.

- **Testing Tools Used:** Mention any specific tools or frameworks you used for testing.
Playwright (JavaScript)

- **Manual Testing:** Describe any manual testing done, if applicable.
- Preliminary exploratory testing to understand the scope of the test strategy and define assumptions to help write the tests accordingly.
- UI check for any major issue.
- Page Source check for any security issue and password leak.


## QA Checklist
Please ensure you have checked all the following items:

- [x] Code compiles without errors.
- [ ] All new and existing tests pass. // _**3 Tests Fails kept for the purpose of this QA challenge and avoid false positives.**_
- [x] Code follows the project's coding standards.
- [x] You have commented your code, particularly in hard-to-understand areas.
- [x] You have thoroughly tested your changes.
- [x] You have included relevant documentation (if applicable).

## Screenshots
If your changes affect the UI, include screenshots or screen recordings to demonstrate them.

## Additional Notes
- The failing test cases "browseBackAfterLogginIn", "browseBackAfterLoggingOut" & "directURLAfterLoggingOut" are purposely kept failing.
Leaving the failing tests as they are serves as a visible reminder of the existing issues, prompting action to resolve them.
These issues would of course be saved in the bug database/management system.

- It has been observed that the Logging Out functionality is not behaving as expected.
The session remains active and the other sections of the website that should be restricted to logged-in users only are still accessible by direct URLs after clicking "Log Out".

- Multiple error messages are accumulating when valid credentials are repeatedly failed to be entered during the login process.

- It seems that Chrome throws an error when manually logging in and adding trailing spaces in the email field. This issue does not seem to occur when running the automation script.

---

## For Reviewers
- Please review the code changes for technical accuracy and adherence to best practices.
- Verify if the test cases adequately cover the code changes.
- Ensure that the PR follows the project's contribution guidelines.
- Provide constructive feedback to help the candidate improve.

---
