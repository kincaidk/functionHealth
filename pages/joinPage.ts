import { Page, Locator } from '@playwright/test'

export class JoinPage {
    readonly page: Page
    readonly legalFirstNameField: Locator
    readonly legalLastNameField: Locator
    readonly emailField: Locator
    readonly phoneNumberField: Locator
    readonly passwordField: Locator
    readonly termsOfUseCheckbox: Locator
    readonly submitButton: Locator

    constructor(page: Page) {
        this.page = page
        this.legalFirstNameField = page.getByRole('textbox', { name: 'Legal First Name' })
        this.legalLastNameField = page.getByRole('textbox', { name: 'Legal Last Name' })
        this.emailField = page.getByRole('textbox', { name: 'Email' })
        this.phoneNumberField = page.getByRole('textbox', { name: 'Phone Number' })
        this.passwordField = page.getByRole('textbox', { name: 'Password' })
        this.termsOfUseCheckbox = page.getByRole('button', { name: 'I agree to Ezra\'s terms of use' })
        this.submitButton = page.getByRole('button', { name: 'Submit' })
    }

    async signUp(params: { firstName: string, lastName: string, email: string, phoneNumber: string, password: string }): Promise<void> { // TODO - Return an instance of whatever page this leads to (i think it's the login page)
        const { firstName, lastName, email, phoneNumber, password, } = params
        
        await this.legalFirstNameField.fill(firstName)
        await this.legalLastNameField.fill(lastName)
        await this.emailField.fill(email)
        await this.phoneNumberField.fill(phoneNumber)
        await this.passwordField.fill(password)
        
        await this.termsOfUseCheckbox.click()
        await this.submitButton.click()
    }
}