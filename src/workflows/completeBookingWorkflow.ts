import { Page } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'
import { JoinPage } from '../pages/joinPage'
import { CookieConsentPrompt } from '../components/cookieConsentPrompt'
import { SelectPlanPage } from '../pages/selectPlan'
import { MemberTestData } from '../fixtures/memberTestData'
import { BookingTestData } from '../fixtures/bookingTestData'
import { CheckoutType } from '../enums/checkout.enums'
import { YesNoMode } from '../components/yesNoQuestions'
import { ScheduleScanPage } from '../pages/scheduleScanPage'
import { ReserveAppointmentPage } from '../pages/reserveAppointment'
import { ScanConfirmPage } from '../pages/scanConfirmPage'

export class CompleteBookingWorkflow {
    readonly page: Page
    readonly member: MemberTestData
    readonly booking: BookingTestData
    readonly checkoutType: CheckoutType

    constructor(params: { page: Page, member: MemberTestData, booking: BookingTestData, checkoutType: CheckoutType }) {
        const { page, member, booking, checkoutType } = params

        this.page = page
        this.member = member
        this.booking = booking
        this.checkoutType = checkoutType
    }

    async createAccount(): Promise<SelectPlanPage> {
        // Begin new account creation process
        const loginPage: LoginPage = new LoginPage(this.page)
        await loginPage.goTo()
        const joinPage: JoinPage = await loginPage.goToJoinPage()

        // Close the cookie consent prompt
        const cookieConsentPrompt: CookieConsentPrompt = new CookieConsentPrompt(this.page)
        await cookieConsentPrompt.acceptCookies()

        // Finish new account creation process
        const selectPlanPage: SelectPlanPage = await joinPage.signUp(this.member)
        return selectPlanPage
    }

    async completeSelectPlanPage(selectPlanPage: SelectPlanPage): Promise<ScheduleScanPage> {
        // Select birth date & sex
        await selectPlanPage.enterBirthDate(this.member.birthDate)
        await selectPlanPage.chooseSexAtBirth(this.member.sexAtBirth)
    
        // Select primary scan & add-on(s)
        await selectPlanPage.choosePrimaryScan(this.booking.scan)
        await selectPlanPage.chooseAddOns(this.booking.addOns)
    
        // Continue + Yes/No questions about the heart (if necessary)
        const yesNoMode: YesNoMode = YesNoMode.AllNo
        const scheduleScanPage: ScheduleScanPage = await selectPlanPage.continue(yesNoMode)
        return scheduleScanPage
    }

    async completeScheduleScanPage(scheduleScanPage: ScheduleScanPage): Promise<ReserveAppointmentPage> {
        await scheduleScanPage.chooseState()
        await scheduleScanPage.chooseCenter()

        // Schedule appointments
        await scheduleScanPage.selectAppointmentDatesAndTimes({ appointmentNumber: 1 })
        await scheduleScanPage.selectAppointmentDatesAndTimes({ appointmentNumber: 2 }) // NOTE: Only `MRI Scan With Skeletal And Neurological Assessment` requires a second appointment.

        // Continue
        const reserveAppointmentPage = await scheduleScanPage.continue()
        return reserveAppointmentPage
    }

    async completeReserveAppointmentPage(reserveAppointmentPage: ReserveAppointmentPage): Promise<ScanConfirmPage> {
        const scanConfirmPage = await reserveAppointmentPage.checkout({ checkoutType: this.checkoutType, email: this.member.email(), phoneNumber: this.member.phoneNumber })
        return scanConfirmPage
    }
}

