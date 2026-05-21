import { test, expect, Locator } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { JoinPage } from '../pages/joinPage';
import { Scan, SelectPlanPage, Sex } from '../pages/selectPlan';
import { chooseRandomEnumValue } from '../functions/helpers';
import { ScheduleScanPage } from '../pages/scheduleScanPage';
import { YesNoMode } from '../components/yesNoQuestions';
import { CookieConsentPrompt } from '../components/cookieConsentPrompt';
import { ScanConfirmPage } from '../pages/scanConfirmPage';


test('e2e booking test', async ({ page }) => {
  // Being new account creation process 
  const loginPage: LoginPage = new LoginPage(page)
  await loginPage.goTo()
  const joinPage: JoinPage = await loginPage.goToJoinPage()

  // Close the cookie consent prompt
  const cookieConsentPrompt: CookieConsentPrompt = new CookieConsentPrompt(page)
  await cookieConsentPrompt.acceptCookies()

  // Finish new account creation process
  const firstName: string = "Playwright FirstName"
  const lastName: string = "Playwright LastName"
  const email: string = `playwright+${Date.now()}@gmail.com`
  const phoneNumber: string = "+1 301-654-6546"
  const password: string = "Testtest0"
  const selectPlanPage: SelectPlanPage = await joinPage.signUp({firstName, lastName, email, phoneNumber, password})

  //// Confirm we landed on the `Select Your Scan` page
  await expect(selectPlanPage.selectYourScanHeading).toBeVisible()

  
  // Select birth date and sex
  const birthDate: string = "01-01-1990"
  const sexAtBirth: Sex = chooseRandomEnumValue(Sex)
  await selectPlanPage.enterBirthDate(birthDate)
  await selectPlanPage.chooseSexAtBirth(sexAtBirth)

  // Select primary scan
  const selectedScan: Scan = Scan.MriScanWithSkeletalAndNeurologicalAssessment//chooseRandomEnumValue(Scan)
  await selectPlanPage.choosePrimaryScan(selectedScan)

  // Select add-on(s)
  await selectPlanPage.chooseAddOns({includeHeartScanAddOn: true, includeLungsScanAddOn: true})

  // Continue
  const yesNoMode: YesNoMode = YesNoMode.AllNo //chooseRandomEnumValue(YesNoMode)
  const scheduleScanPage: ScheduleScanPage = await selectPlanPage.continue(yesNoMode)

  //// Confirm we landed on the `Schedule your scan` page
  await expect(scheduleScanPage.scheduleYourScanHeading).toBeVisible()


  // Select the state
  await scheduleScanPage.chooseState()

  // Select the center
  await scheduleScanPage.chooseCenter()

  // Select the dates and times for appointment 1
  await scheduleScanPage.selectAppointmentDatesAndTimes({ appointmentNumber: 1 })

  // Select the dates and times for appointment 2, if necessary
  const appointment2Calendar: Locator = scheduleScanPage.findCalendarForAppointment(2)
  if (await appointment2Calendar.isVisible()) {
    await scheduleScanPage.selectAppointmentDatesAndTimes({ appointmentNumber: 2 })
  }

  // Continue
  const reserveAppointmentPage = await scheduleScanPage.continue()

  //// Confirm we landed on the 'Reserve Appointment' page
  await expect(reserveAppointmentPage.reserveYourAppointmentHeading).toBeVisible()

  // Fill out payment details
  // await reserveAppointmentPage.fillOutBankDetails()
  await reserveAppointmentPage.fillOutCardDetails()
  const scanConfirmPage: ScanConfirmPage = new ScanConfirmPage(page)
  await Promise.all([
    reserveAppointmentPage.continue(),
    page.waitForURL(scanConfirmPage.url)
  ])
  

  // await page.waitForTimeout(10_000)
  await expect(scanConfirmPage.beingMedicalQuestionnaireButton).toBeVisible()

  // await reserveAppointmentPage._test()
});







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