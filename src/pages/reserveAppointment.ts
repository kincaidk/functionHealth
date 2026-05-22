import { Page, Locator, FrameLocator } from '@playwright/test'
import { getMMYYForNextYear } from '../functions/helpers'
import { ScanConfirmPage } from './scanConfirmPage'
import { stripeCardNumber, stripeRoutingNumber, stripeAccountNumbers } from '../constants/stripe'
import { CheckoutType } from '../constants/checkoutType'

export class ReserveAppointmentPage {
    readonly page: Page
    readonly reserveYourAppointmentHeading: Locator

    readonly cardNumber: string = stripeCardNumber
    readonly expirationDate: string = getMMYYForNextYear()
    readonly securityCode: string = '123'
    readonly postalCode: string = '43214'

    // iFrames
    readonly cardPaymentFrame: FrameLocator
    readonly bankPaymentFrame: FrameLocator
    readonly bankPaymentLinkedAccountsFrame: FrameLocator
    readonly googlePayPaymentFrame: FrameLocator

    // Tabs
    readonly cardTab: Locator
    readonly bankTab: Locator
    readonly googlePayTab: Locator
    readonly affirmTab: Locator

    // Card elements
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

    // Google Pay elements
    readonly googlePayPayNowButton: Locator

    // Affirm elements
    readonly affirmPhoneNumberField: Locator
    readonly affirmContinueButton: Locator
    readonly affirmVerificationCodeInput: Locator
    readonly affirmPaymentPlanOptions: Locator
    readonly affirmChooseThisPlanButton: Locator
    readonly affirmFullNameField: Locator
    readonly affirmRoutingNumberField: Locator
    readonly affirmAccountNumberField: Locator
    readonly affirmDisclosureCheckbox: Locator
    readonly affirmConfirmButton: Locator

    // Page navigation buttons
    readonly backButton
    readonly continueButton

    constructor(page: Page) {
        this.page = page
        this.reserveYourAppointmentHeading = page.getByRole('heading', { name: 'Reserve your appointment' })

        
        // iFrames
        this.cardPaymentFrame = page.locator('iframe[title="Secure payment input frame"]').first().contentFrame()
        this.bankPaymentFrame = page.locator('iframe[title="Bank search results"]').first().contentFrame()
        this.bankPaymentLinkedAccountsFrame = page.locator('iframe[src*="linked-accounts-inner"]').first().contentFrame()
        this.googlePayPaymentFrame = page.locator('iframe[title="Complete your purchase"]').first().contentFrame()

        // Tabs
        this.cardTab = this.cardPaymentFrame.getByRole('button', { name: 'Card' }).getByRole('presentation').first()
        this.bankTab = this.cardPaymentFrame.getByRole('button', { name: 'Bank' }).getByRole('presentation').first()
        this.googlePayTab = this.cardPaymentFrame.getByRole('button', { name: 'Google Pay' }).getByRole('presentation').first()
        this.affirmTab = this.cardPaymentFrame.getByRole('button', { name: 'Affirm' }).getByRole('presentation').first()

        // Card elements
        this.cardNumberField = this.cardPaymentFrame.locator('#payment-numberInput')
        this.expirationDateField = this.cardPaymentFrame.locator('#payment-expiryInput')
        this.securityCodeField = this.cardPaymentFrame.locator('#payment-cvcInput')
        this.postalCodeField = this.cardPaymentFrame.locator('#payment-postalCodeInput')

        // Bank elements
        this.successfulBankMenuItem = this.cardPaymentFrame.getByRole('menuitem', { name: 'Success' })
        this.linkAgreeAndContinueButton = this.bankPaymentLinkedAccountsFrame.getByRole('button', { name: 'Agree and continue' })
        this.linkEmailField = this.bankPaymentLinkedAccountsFrame.getByTestId('link-email-input')
        this.linkPhoneNumberField = this.bankPaymentLinkedAccountsFrame.getByRole('textbox', { name: 'Phone number' })
        this.linkContinueWithLinkButton = this.bankPaymentLinkedAccountsFrame.getByTestId('link-signup-button')
        this.linkConnectAccountButton = this.bankPaymentLinkedAccountsFrame.getByTestId('select-button')
        this.linkDoneButton = this.bankPaymentLinkedAccountsFrame.getByTestId('done-button')

        // Google Pay elements
        this.googlePayPayNowButton = this.googlePayPaymentFrame.getByRole('button', { name: 'Pay now' })

        // Affirm elements
        this.affirmPhoneNumberField = page.getByTestId('phone-number-field')
        this.affirmContinueButton = page.getByTestId('submit-button')
        this.affirmVerificationCodeInput = page.getByTestId('phone-pin-field')
        this.affirmPaymentPlanOptions = page.getByRole('radiogroup').getByTestId('term-card') // should match multiple elements
        this.affirmChooseThisPlanButton = page.getByTestId('continue-with-selected-term-button')
        this.affirmFullNameField = page.getByTestId('full-name-field')
        this.affirmRoutingNumberField = page.getByTestId('routing-number-field')
        this.affirmAccountNumberField = page.getByTestId('ach-account-number-field')
        this.affirmDisclosureCheckbox = page.getByTestId('disclosure-checkbox-indicator')
        this.affirmConfirmButton = page.getByTestId('submit-button')

        // Page navigation buttons
        this.backButton = page.locator('[data-test="cancel"]')
        this.continueButton = page.locator('[data-test="submit"]')

    }

    async back(): Promise<void> {
        await this.backButton.click()
        // TODO - Not super necessary for the assignment, but -> add validation for landing on the Schedule Scan page. 
    }

    async continue(params: { checkoutType: CheckoutType, phoneNumber?: string }): Promise<ScanConfirmPage> {
        const { checkoutType, phoneNumber = "" } = params

        await this.continueButton.click()

        switch(checkoutType) {
            case CheckoutType.Card:
                break
            case CheckoutType.Bank:
                break
            case CheckoutType.GooglePay:
                await this.googlePayPayNowButton.click()
                break
            case CheckoutType.Affirm:
                await this.affirmPhoneNumberField.fill(phoneNumber)
                await this.affirmContinueButton.click()
                await this.affirmVerificationCodeInput.fill("123456")
                const randomPaymentPlanIndex: number = Math.floor(Math.random() * (await this.affirmPaymentPlanOptions.count()))
                await this.affirmPaymentPlanOptions.nth(randomPaymentPlanIndex).click()
                await this.affirmChooseThisPlanButton.click()

                // NOTE: These are in if-statements because Affirm saves the bank account data based on the email used. 
                // Even though the tests use `playwright+${Date.now()}@gmail.com` to make unique emails, Affirm seems to only care about what's before the plus sign.
                if (await this.affirmFullNameField.isVisible()) {
                    await this.affirmFullNameField.fill("test test")
                }
                if (await this.affirmRoutingNumberField.isVisible()) {
                    await this.affirmRoutingNumberField.fill(stripeRoutingNumber)
                }
                if (await this.affirmAccountNumberField.isVisible()) {
                    await this.affirmAccountNumberField.fill(stripeAccountNumbers.success!)
                }

                await this.affirmDisclosureCheckbox.click()
                await this.affirmConfirmButton.click()
                break
            default:
                throw(`(2) Unrecognized checkout type: ${checkoutType}`)
        }

        const scanConfirmPage: ScanConfirmPage = new ScanConfirmPage(this.page)
        await this.page.waitForURL(scanConfirmPage.url)
        return scanConfirmPage 
    }

    async cardCheckout(): Promise<ScanConfirmPage> {
        await this.page.waitForTimeout(2_000); // wait because Stripe is async
        await this.cardTab.evaluate((tab) => {
            tab.scrollIntoView({
                block: 'center',
                inline: 'center',
            })
        })
        await this.cardTab.click()

        await this.cardNumberField.fill(this.cardNumber)
        await this.expirationDateField.fill(this.expirationDate)
        await this.securityCodeField.fill(this.securityCode)
        await this.postalCodeField.fill(this.postalCode)

        return await this.continue({ checkoutType: CheckoutType.Card })
    }

    async bankCheckout(params: { email: string, phoneNumber: string }): Promise<ScanConfirmPage> {
        const { email, phoneNumber } = params

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

        return await this.continue({ checkoutType: CheckoutType.Bank })
    }

    // NOTE: For whatever reason, Google Pay doesn't appear as an option when Playwright is driving...
    async googlePayCheckout(): Promise<ScanConfirmPage> {
        await this.page.waitForTimeout(2_000); // wait because Stripe is async
        await this.googlePayTab.evaluate((tab) => {
            tab.scrollIntoView({
                block: 'center',
                inline: 'center',
            })
        })
        await this.googlePayTab.click()

        return await this.continue({ checkoutType: CheckoutType.GooglePay })
    }

    async affirmCheckout(phoneNumber: string): Promise<ScanConfirmPage> {
        await this.page.waitForTimeout(2_000); // wait because Stripe is async
        await this.affirmTab.evaluate((tab) => {
            tab.scrollIntoView({
                block: 'center',
                inline: 'center',
            })
        })
        await this.affirmTab.click()

        return await this.continue({ checkoutType: CheckoutType.Affirm, phoneNumber })
    }

    async checkout(params: { checkoutType: CheckoutType, email?: string, phoneNumber?: string }): Promise<ScanConfirmPage> {
        const { checkoutType, email = "", phoneNumber = "" } = params

        let scanConfirmPage: ScanConfirmPage
        switch(checkoutType) {
            case CheckoutType.Card:
                scanConfirmPage = await this.cardCheckout()
                break
            case CheckoutType.Bank:
                scanConfirmPage = await this.bankCheckout({ email, phoneNumber })
                break
            case CheckoutType.GooglePay:
                scanConfirmPage = await this.googlePayCheckout()
                break
            case CheckoutType.Affirm:
                scanConfirmPage = await this.affirmCheckout(phoneNumber)
                break
            default:
                throw(`(1) Unrecognized checkout type: ${checkoutType}`)
        }

        return scanConfirmPage
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