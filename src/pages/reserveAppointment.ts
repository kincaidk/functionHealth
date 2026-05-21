import { Page, Locator, FrameLocator } from '@playwright/test'
import { getMMYYForNextYear } from '../functions/helpers'
import { LoginPage } from './loginPage'
import { ScanConfirmPage } from './scanConfirmPage'

export class ReserveAppointmentPage {
    readonly page: Page
    readonly reserveYourAppointmentHeading: Locator

    readonly cardNumber: string = '4242424242424242'
    readonly expirationDate: string = getMMYYForNextYear()
    readonly securityCode: string = '123'
    readonly postalCode: string = '43214'

    readonly chooseAPaymentMethodHeading: Locator
    readonly paymentOptionsFrame: FrameLocator
    readonly cardNumberField: Locator
    readonly expirationDateField: Locator
    readonly securityCodeField: Locator
    readonly postalCodeField: Locator

    readonly bankTab: Locator

    // readonly bankSearchResultsFrame: FrameLocator
    // readonly paymentAccordionWrapper: Locator

    readonly backButton
    readonly continueButton

    constructor(page: Page) {
        this.page = page
        this.reserveYourAppointmentHeading = page.getByRole('heading', { name: 'Reserve your appointment' })

        this.chooseAPaymentMethodHeading = page.getByRole('heading', { name: 'Choose a payment method' })
        this.paymentOptionsFrame = page.locator('iframe[title="Secure payment input frame"]').first().contentFrame()
        this.cardNumberField = this.paymentOptionsFrame.locator('#payment-numberInput')
        this.expirationDateField = this.paymentOptionsFrame.locator('#payment-expiryInput')
        this.securityCodeField = this.paymentOptionsFrame.locator('#payment-cvcInput')
        this.postalCodeField = this.paymentOptionsFrame.locator('#payment-postalCodeInput')

        this.bankTab = this.paymentOptionsFrame.getByRole('button', { name: 'Bank' })

        // this.bankSearchResultsFrame = page.frameLocator('iframe[title="Bank search results"]')
        // this.paymentAccordionWrapper = page.getByTestId('payment-accordion-wrapper')

        this.backButton = page.locator('[data-test="cancel"]')
        this.continueButton = page.locator('[data-test="submit"]')

    }

    async back(): Promise<void> {
        await this.backButton.click()
        // TODO - Not super necessary for the assignment, but -> add validation for landing on the Schedule Scan page. 
    }

    async continue(): Promise<ScanConfirmPage> {
        await this.continueButton.click()
        const scanConfirmPage: ScanConfirmPage = new ScanConfirmPage(this.page)
        return scanConfirmPage 
    }

    async fillOutCardDetails(): Promise<void> {
        await this.cardNumberField.fill(this.cardNumber)
        await this.expirationDateField.fill(this.expirationDate)
        await this.securityCodeField.fill(this.securityCode)
        await this.postalCodeField.fill(this.postalCode)
    }

    async fillOutBankDetails(): Promise<void> {
        await this.bankTab.click()
    }

    // async _test() {
    //     await this.page.waitForTimeout(2_000); // wait becasue Stripe is async
    //     const inputs = this.paymentOptionsFrame.locator('input')
    //     const count = await this.paymentOptionsFrame.locator('input').count()
    //     console.log(count); // 11

    //     for (let i = 0; i < count; i++) {
    //         console.log("NAME ---")
    //         console.log(await inputs.nth(i).getAttribute("name"))
    //         console.log("TITLE ---")
    //         console.log(await inputs.nth(i).getAttribute("title"))
    //         console.log("ID ---")
    //         console.log(await inputs.nth(i).getAttribute("id"))
    //         console.log("DATA-TESTID ---")
    //         console.log(await inputs.nth(i).getAttribute("data-testId"))
    //         console.log("CLASS ---")
    //         console.log(await inputs.nth(i).getAttribute("class"))
    //     }
    // }

}