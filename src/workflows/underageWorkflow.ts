import { Page } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'
import { JoinPage } from '../pages/joinPage'
import { CookieConsentPrompt } from '../components/cookieConsentPrompt'
import { SelectPlanPage } from '../pages/selectPlan'
import { MemberTestData } from '../fixtures/memberTestData'
import { BookingTestData } from '../fixtures/bookingTestData'
import { CheckoutType } from '../enums/checkout.enums'

export class UnderageWorkflow {
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

    async fillOutSelectPlanPage(selectPlanPage: SelectPlanPage): Promise<void> {
        // Select birth date & sex
        await selectPlanPage.enterBirthDate(this.member.birthDate)
        await selectPlanPage.chooseSexAtBirth(this.member.sexAtBirth) // expecting a date that makes the member under 18 years old.
    
        // Select primary scan & add-on(s)
        await selectPlanPage.choosePrimaryScan(this.booking.scan)
        await selectPlanPage.chooseAddOns(this.booking.addOns)
    }
}

