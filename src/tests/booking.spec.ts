import { test, expect, Locator } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { JoinPage } from '../pages/joinPage';
import { Scan, SelectPlanPage, Sex } from '../pages/selectPlan';
import { chooseRandomEnumValue } from '../functions/helpers';
import { ScheduleScanPage } from '../pages/scheduleScanPage';
import { YesNoMode } from '../components/yesNoQuestions';
import { CookieConsentPrompt } from '../components/cookieConsentPrompt';
import { CheckoutType } from '../constants/checkoutType';

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
  const phoneNumber: string = "3016546546"
  const password: string = "Testtest0"

  const selectPlanPage: SelectPlanPage = await joinPage.signUp({firstName, lastName, email, phoneNumber, password})

  //// Confirm we landed on the `Select Your Scan` page
  await expect(selectPlanPage.selectYourScanHeading).toBeVisible()

  
  // Select birth date and sex
  const birthDate: string = "01-01-1990"
  const sexAtBirth: Sex = chooseRandomEnumValue({ enumToChooseFrom: Sex })
  await selectPlanPage.enterBirthDate(birthDate)
  await selectPlanPage.chooseSexAtBirth(sexAtBirth)

  // Select primary scan
  const selectedScan: Scan = chooseRandomEnumValue({ enumToChooseFrom: Scan })
  await selectPlanPage.choosePrimaryScan(selectedScan)

  // Select add-on(s)
  await selectPlanPage.chooseAddOns({includeHeartScanAddOn: true, includeLungsScanAddOn: true})

  // Continue
  const yesNoMode: YesNoMode = YesNoMode.AllNo //chooseRandomEnumValue({ enumToChooseFrom: YesNoMode })
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

  // Checkout
  const randomCheckoutType = chooseRandomEnumValue({ enumToChooseFrom: CheckoutType, valuesToAvoid: [ CheckoutType.GooglePay ] })
  const scanConfirmPage = await reserveAppointmentPage.checkout({ checkoutType: randomCheckoutType, email, phoneNumber })

  // Confirm we finsihed paying by checking if we landed on the Scan Confirm page.
  await expect(scanConfirmPage.beingMedicalQuestionnaireButton).toBeVisible()
});
