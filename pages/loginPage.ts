import { Page, Locator } from '@playwright/test'
import { JoinPage } from './joinPage'

export class LoginPage {
    readonly page: Page
    readonly emailField: Locator
    readonly passwordField: Locator
    readonly submitButton: Locator
    readonly joinLink: Locator

    constructor(page: Page) {
        this.page = page
        this.emailField = page.getByRole('textbox', { name: 'Email' })
        this.passwordField = page.getByRole('textbox', { name: 'Password' })
        this.submitButton = page.getByRole('button', { name: 'Submit' })
        this.joinLink = page.getByRole('link', { name: 'Join' })
    }

    async goToLoginPage(): Promise<void> {
        await this.page.goto('https://myezra-staging.ezra.com/sign-in')
    }

    async goToJoinPage(): Promise<JoinPage> {
        await this.joinLink.click()
        return new JoinPage(this.page)
    }

    async signIn(params: {email: string, password: string}): Promise<void> { // TODO - Return an instance of the class for the landing page.
        const { email, password } = params

        await this.emailField.fill(email)
        await this.passwordField.fill(password)
        await this.submitButton.click()
    }
}