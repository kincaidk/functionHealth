import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { JoinPage } from '../pages/joinPage';
import { SelectPlanPage } from '../pages/selectPlan';


test('e2e booking test', async ({ page }) => {
  const loginPage: LoginPage = new LoginPage(page)
  await loginPage.goTo()
  const joinPage: JoinPage = await loginPage.goToJoinPage()

  const firstName: string = "Playwright FirstName"
  const lastName: string = "Playwright LastName"
  const email: string = `playwright+${Date.now()}@gmail.com`
  const phoneNumber: string = "+1 301-654-6546"
  const password: string = "Testtest0"
  const selectPlanPage: SelectPlanPage = await joinPage.signUp({firstName, lastName, email, phoneNumber, password})

  await expect(selectPlanPage.selectYourScanHeading).toBeVisible()
});


// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });





// const { validate: isUUID } = await import('uuid');

  // // Create members A & B
  // const memberAEmail: string = `Kellenceo+${Date.now()}@gmail.com`
  // const memberBEmail: string = `Kellenceo+${Date.now()}@gmail.com`
  // const password: string = "Testtest0"
  // const firstName: string = "KellenTest"
  // const lastName: string = "Test"
  // const phoneNumber: string = "+1 301-654-6546"
  // const memberACreationResponse = await createNewMember({ firstName, lastName, email: memberAEmail, password, phoneNumber })
  // const memberBCreationResponse = await createNewMember({ firstName, lastName, email: memberBEmail, password, phoneNumber })

  // const memberAIdSuccessfullyGenerated: boolean = 'data' in memberACreationResponse && isUUID(memberACreationResponse.data)
  // const memberBIdSuccessfullyGenerated: boolean = 'data' in memberBCreationResponse && isUUID(memberBCreationResponse.data)

  // expect(memberAIdSuccessfullyGenerated).toBeTruthy()
  // expect(memberBIdSuccessfullyGenerated).toBeTruthy()

  // // Generate memberA token
  // const memberATokenResponse = await getToken(memberAEmail, password)

  // // Generate memberB token
  // const memberBTokenResponse = await getToken(memberBEmail, password)

  // // Make sure tokens were generated
  // const tokenType: string = TOKEN_TYPE.ACCESS!
  // const tokenAWasGenerated: boolean = 'data' in memberATokenResponse && tokenType in memberATokenResponse.data && memberATokenResponse.data[tokenType].length > 0
  // const tokenBWasGenerated: boolean = 'data' in memberBTokenResponse && tokenType in memberBTokenResponse.data && memberBTokenResponse.data[tokenType].length > 0
  // expect(tokenAWasGenerated).toBeTruthy()
  // expect(tokenBWasGenerated).toBeTruthy()

  // // Grab tokens from responses
  // const memberAToken = memberATokenResponse.data[tokenType]
  // const memberBToken = memberBTokenResponse.data[tokenType]

  // // Create headers
  // const memberAHeaders = {
  //   'authorization': `Bearer ${memberAToken}`
  // }
  // const memberBHeaders = {
  //   'authorization': `Bearer ${memberBToken}`
  // }

  // const response = await axios.get(URLS.ALL_DATA!, { memberAHeaders })