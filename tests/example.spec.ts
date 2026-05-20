import { test, expect } from '@playwright/test';
import { createNewMember, getToken } from '../functions/apiRequests';
import { TOKEN_TYPE } from '../constants/tokenType';

// QUESTION 2 - PART 2 - HTTP requests
test('[API] Create 2 members and verify that they cant see each other\'s data.', async ({ page }) => {
  

  
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