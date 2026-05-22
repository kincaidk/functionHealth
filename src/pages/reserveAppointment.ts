import { Page, Locator, FrameLocator } from '@playwright/test'
import { getMMYYForNextYear } from '../functions/helpers'
import { ScanConfirmPage } from './scanConfirmPage'

export class ReserveAppointmentPage {
    readonly page: Page
    readonly reserveYourAppointmentHeading: Locator

    readonly cardNumber: string = '4242424242424242'
    readonly expirationDate: string = getMMYYForNextYear()
    readonly securityCode: string = '123'
    readonly postalCode: string = '43214'

    // iFrames
    readonly cardPaymentFrame: FrameLocator
    readonly bankPaymentFrame: FrameLocator
    readonly bankPaymentLinkedAccountsFrame: FrameLocator

    // Tabs
    readonly cardTab: Locator
    readonly bankTab: Locator
    readonly googlePayTab: Locator
    readonly affirmTab: Locator

    // Card fields
    readonly cardNumberField: Locator
    readonly expirationDateField: Locator
    readonly securityCodeField: Locator
    readonly postalCodeField: Locator

    // Bank elements
    readonly successfulBankMenuItem: Locator
    readonly linkAgreeAndContinueButton: Locator
    readonly linkEmailField: Locator
    readonly linkPhoneNumberField: Locator
    readonly linkContinueWithLinkButton: Locator
    readonly linkConnectAccountButton: Locator
    readonly linkDoneButton: Locator

    readonly backButton
    readonly continueButton

    constructor(page: Page) {
        this.page = page
        this.reserveYourAppointmentHeading = page.getByRole('heading', { name: 'Reserve your appointment' })

        
        // iFrames
        this.cardPaymentFrame = page.locator('iframe[title="Secure payment input frame"]').first().contentFrame()
        this.bankPaymentFrame = page.locator('iframe[title="Bank search results"]').first().contentFrame()
        this.bankPaymentLinkedAccountsFrame = page.locator('iframe[src*="linked-accounts-inner"]').first().contentFrame()
        

        // TODO - Improve these locators
        // Tabs
        this.cardTab = this.cardPaymentFrame.getByRole('button', { name: 'Card' }).getByRole('presentation').first()
        this.bankTab = this.cardPaymentFrame.getByRole('button', { name: 'Bank' }).getByRole('presentation').first()
        this.googlePayTab = this.cardPaymentFrame.getByRole('button', { name: 'Google Pay' }).getByRole('presentation').first()
        this.affirmTab = this.cardPaymentFrame.getByRole('button', { name: 'Affirm' }).getByRole('presentation').first()

        // Card fields
        this.cardNumberField = this.cardPaymentFrame.locator('#payment-numberInput')
        this.expirationDateField = this.cardPaymentFrame.locator('#payment-expiryInput')
        this.securityCodeField = this.cardPaymentFrame.locator('#payment-cvcInput')
        this.postalCodeField = this.cardPaymentFrame.locator('#payment-postalCodeInput')

        // TODO - Bank elements
        this.successfulBankMenuItem = this.cardPaymentFrame.getByRole('menuitem', { name: 'Success' })
        this.linkAgreeAndContinueButton = this.bankPaymentLinkedAccountsFrame.getByRole('button', { name: 'Agree and continue' })
        this.linkEmailField = this.bankPaymentLinkedAccountsFrame.getByTestId('link-email-input')
        this.linkPhoneNumberField = this.bankPaymentLinkedAccountsFrame.getByRole('textbox', { name: 'Phone number' })
        this.linkContinueWithLinkButton = this.bankPaymentLinkedAccountsFrame.getByTestId('link-signup-button')
        this.linkConnectAccountButton = this.bankPaymentLinkedAccountsFrame.getByTestId('select-button')
        this.linkDoneButton = this.bankPaymentLinkedAccountsFrame.getByTestId('done-button')


        this.backButton = page.locator('[data-test="cancel"]')
        this.continueButton = page.locator('[data-test="submit"]')

    }

    async back(): Promise<void> {
        await this.backButton.click()
        // TODO - Not super necessary for the assignment, but -> add validation for landing on the Schedule Scan page. 
    }

    // TODO - This doesn't always lead to the ScanConfirmPage (other payment methods have different destinations)
    async continue(): Promise<ScanConfirmPage> {
        await this.continueButton.click()
        const scanConfirmPage: ScanConfirmPage = new ScanConfirmPage(this.page)
        return scanConfirmPage 
    }

    async cardCheckout(): Promise<void> {
        await this.page.waitForTimeout(2_000); // wait because Stripe is async
        await this.cardTab.click()

        await this.cardNumberField.fill(this.cardNumber)
        await this.expirationDateField.fill(this.expirationDate)
        await this.securityCodeField.fill(this.securityCode)
        await this.postalCodeField.fill(this.postalCode)
    }

    async bankCheckout(email: string, phoneNumber: string): Promise<void> {
        await this.page.waitForTimeout(2_000); // wait because Stripe is async
        await this.bankTab.evaluate((tab) => {
            tab.scrollIntoView({
                block: 'center',
                inline: 'center',
            })
        })
        await this.bankTab.click()
        await this.successfulBankMenuItem.click()
        await this.linkAgreeAndContinueButton.click()
        await this.linkEmailField.fill(email)
        await this.linkPhoneNumberField.fill(phoneNumber)
        await this.linkContinueWithLinkButton.click()
        await this.linkConnectAccountButton.click()
        await this.linkDoneButton.click()
    }

    async googlePayCheckout(): Promise<void> {
        await this.page.waitForTimeout(2_000); // wait because Stripe is async
        await this.googlePayTab.click()

        // TODO - Fill out the rest
    }

    async affirmCheckout(): Promise<void> {
        await this.page.waitForTimeout(2_000); // wait because Stripe is async
        await this.affirmTab.click()

        // TODO - Fill out the rest
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