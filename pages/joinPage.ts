import { Page, Locator } from '@playwright/test'

export class JoinPage {
    readonly page: Page
    readonly legalFirstNameField: Locator
    readonly legalLastNameField: Locator
    readonly phoneNumberField: Locator
    readonly passwordField: Locator
    readonly termsOfUseCheckbox: Locator
    readonly submitButton: Locator

    constructor(page: Page) {
        this.page = page
        this.legalFirstNameField = page.getByRole('textbox', { name: 'Legal First Name' })
        this.legalLastNameField = page.getByRole('textbox', { name: 'Legal Last Name' })
        this.phoneNumberField = page.getByRole('textbox', { name: 'Phone Number' })
        this.passwordField = page.getByRole('textbox', { name: 'Password' })
        this.termsOfUseCheckbox = page.getByRole('button', { name: 'I agree to Ezra\'s terms of use' })
        this.submitButton = page.getByRole('button', { name: 'Submit' })
    }
}