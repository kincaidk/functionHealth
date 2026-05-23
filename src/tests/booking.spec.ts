import { test, expect } from '@playwright/test';
import { SelectPlanPage } from '../pages/selectPlan';
import { ScheduleScanPage } from '../pages/scheduleScanPage';
import { MemberTestData, memberTestScenarios } from '../fixtures/memberTestData';
import { CheckoutType } from '../enums/checkout.enums';
import { BookingTestData, bookingTestData } from '../fixtures/bookingTestData';
import { CompleteBookingWorkflow } from '../workflows/completeBookingWorkflow';
import { UnderageWorkflow } from '../workflows/underageWorkflow';
import { YesNoMode } from '../components/yesNoQuestions';

test('booking test - dont allow minors', async ({ page }) => {
  const member: MemberTestData = memberTestScenarios.eighteenYearOldMinusOneDay as MemberTestData
  const booking: BookingTestData = bookingTestData.mriScanNoAddOns as BookingTestData
  const checkoutType: CheckoutType = CheckoutType.Bank
  const underageWorkflow: UnderageWorkflow = new UnderageWorkflow({ page, member, booking, checkoutType })

  const selectPlanPage: SelectPlanPage = await underageWorkflow.createAccount()
  await expect(selectPlanPage.selectYourScanHeading).toBeVisible()

  await underageWorkflow.fillOutSelectPlanPage(selectPlanPage)
  await expect(selectPlanPage.continueButton).toBeDisabled()
})

test('booking test - allow 18 year olds', async ({ page }) => {
  const member: MemberTestData = memberTestScenarios.eighteenYearOld as MemberTestData
  const booking: BookingTestData = bookingTestData.mriScanNoAddOns as BookingTestData
  const checkoutType: CheckoutType = CheckoutType.Bank
  const underageWorkflow: UnderageWorkflow = new UnderageWorkflow({ page, member, booking, checkoutType })

  const selectPlanPage: SelectPlanPage = await underageWorkflow.createAccount()
  await expect(selectPlanPage.selectYourScanHeading).toBeVisible()

  await underageWorkflow.fillOutSelectPlanPage(selectPlanPage)
  await expect(selectPlanPage.continueButton).toBeEnabled()

  const scheduleScanPage: ScheduleScanPage = await selectPlanPage.continue(YesNoMode.AllNo)
  await expect(scheduleScanPage.scheduleYourScanHeading).toBeVisible()
}) 

test('e2e booking test - account creation -> payment', async ({ page }) => {
  const member: MemberTestData = memberTestScenarios.thirtyFiveYearOld as MemberTestData
  const booking: BookingTestData = bookingTestData.mriScanWithSkeletalAndNeurologicalAssessmentWithAllAddOns as BookingTestData
  const checkoutType: CheckoutType = CheckoutType.Bank
  const bookingWorkflow: CompleteBookingWorkflow = new CompleteBookingWorkflow({ page, member, booking, checkoutType })

  const selectPlanPage: SelectPlanPage = await bookingWorkflow.createAccount()
  await expect(selectPlanPage.selectYourScanHeading).toBeVisible() // Confirm we landed on the `Select Your Scan` page

  const scheduleScanPage: ScheduleScanPage = await bookingWorkflow.completeSelectPlanPage(selectPlanPage)
  await expect(scheduleScanPage.scheduleYourScanHeading).toBeVisible() // Confirm we landed on the `Schedule your scan` page

  const reserveAppointmentPage = await bookingWorkflow.completeScheduleScanPage(scheduleScanPage)
  await expect(reserveAppointmentPage.reserveYourAppointmentHeading).toBeVisible() // Confirm we landed on the 'Reserve Appointment' page

  const scanConfirmPage = await bookingWorkflow.completeReserveAppointmentPage(reserveAppointmentPage)
  await expect(scanConfirmPage.beingMedicalQuestionnaireButton).toBeVisible() // Confirm we finsihed paying by checking if we landed on the Scan Confirm page.
});
