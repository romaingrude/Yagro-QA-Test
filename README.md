[![Runs ESLint (JS, Vue, TS)](GITHUB_REPO_URL/actions/workflows/lint.yml/badge.svg)](GITHUB_REPO_URL/actions/workflows/lint.yml)

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

- *Tracker*
- *Tracker > Crop Progress*
- *Tracker > Crop Progress > Wheat (Winter)*

When on the Wheat (Winter) page, you will be able to change the year, and see the crop progress for that year.

💡 Note: Other crops and years are not available in this example on the Crop Progress ‘list’.

---

## 🔧 Ways of working

We’ve set this challenge up to be flexible and we’ve set some things up to make it easier for you.

Create a branch to work on, name it after yourself. For example `sam-wells`.

💡 Please use only hyphens and lowercase for your branch name, no other characters.
For example `sam-wells`. e.g `git checkout -b sam-wells`.


We have installed PLaywright for you, and created a basic test, but you can use any tools you prefer that are compatible.

The tests are located in the /tests folder, please add your tests there. There are also example tests in the /tests-examples folder.

You will need to have the following installed: 
- nodejs
- git

Before running the tests you will need to do yarn install or npm install.

To run the tests you will need too run npx playwright test.

💡 When you are finished, please create a **Pull Request** to merge your branch into `main`. Try to explain your changes in the Pull Request description, your thought process, and any issues you encountered. If you have any issues with this and would like to provide your work in other means, such as via your own repo, zip, WeTransfer etc, this is also acceptable.

> If you have any questions feel free to ask, and enjoy the task! 