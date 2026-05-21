import { Page, Locator } from '@playwright/test'
import { SelectPlanPage } from "./selectPlan"

export class JoinPage {
    readonly page: Page
    readonly orSignUpWithYourEmailText: Locator

    readonly legalFirstNameField: Locator
    readonly legalLastNameField: Locator
    readonly emailField: Locator
    readonly phoneNumberField: Locator
    readonly passwordField: Locator
    readonly termsOfUseCheckbox: Locator
    readonly submitButton: Locator

    constructor(page: Page) {
        this.page = page
        this.orSignUpWithYourEmailText = page.getByText('or sign up with your email')

        this.legalFirstNameField = page.getByRole('textbox', { name: 'Legal First Name' })
        this.legalLastNameField = page.getByRole('textbox', { name: 'Legal Last Name' })
        this.emailField = page.getByRole('textbox', { name: 'Email' })
        this.phoneNumberField = page.getByRole('textbox', { name: 'Phone Number' })
        this.passwordField = page.getByRole('textbox', { name: 'Password' })
        this.termsOfUseCheckbox = page.getByRole('button', { name: 'I agree to Ezra\'s terms of use' })
        this.submitButton = page.getByRole('button', { name: 'Submit' })
    }

    async goTo(): Promise<void> {
        await this.page.goto('https://myezra-staging.ezra.com/join')
        await this.waitForPageToLoad()
    }

    async waitForPageToLoad(): Promise<void> {
        await this.orSignUpWithYourEmailText.waitFor({ state: 'visible' })
    }

    async signUp(params: { firstName: string, lastName: string, email: string, phoneNumber: string, password: string }): Promise<SelectPlanPage> {
        const { firstName, lastName, email, phoneNumber, password, } = params
        
        await this.legalFirstNameField.fill(firstName)
        await this.legalLastNameField.fill(lastName)
        await this.emailField.fill(email)
        await this.phoneNumberField.fill(phoneNumber)
        await this.passwordField.fill(password)

        await this.termsOfUseCheckbox.click()
        await this.submitButton.click() // Navigates to the Select Plan page

        const selectPlanPage: SelectPlanPage = new SelectPlanPage(this.page)
        await selectPlanPage.waitForPageToLoad()

        return selectPlanPage
    }
}