import { Page, Locator } from '@playwright/test'
import { JoinPage } from './joinPage'

export class LoginPage {
    readonly page: Page
    readonly pleaseSignInToYourAccount: Locator
    readonly url: string = 'https://myezra-staging.ezra.com/sign-in'

    readonly emailField: Locator
    readonly passwordField: Locator
    readonly submitButton: Locator
    readonly joinLink: Locator

    constructor(page: Page) {
        this.page = page
        this.pleaseSignInToYourAccount = page.getByRole('heading', { name: 'Please sign in to your account' })

        this.emailField = page.getByRole('textbox', { name: 'Email' })
        this.passwordField = page.getByRole('textbox', { name: 'Password' })
        this.submitButton = page.getByRole('button', { name: 'Submit' })
        this.joinLink = page.getByRole('link', { name: 'Join' })
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url)
        await this.waitForPageToLoad()
    }

    async waitForPageToLoad(): Promise<void> {
        await this.pleaseSignInToYourAccount.waitFor({ state: 'visible' })
    }

    async goToJoinPage(): Promise<JoinPage> {
        await this.joinLink.click()
        const joinPage: JoinPage = new JoinPage(this.page)
        await joinPage.waitForPageToLoad()

        return joinPage
    }

    async signIn(params: {email: string, password: string}): Promise<void> { // TODO - Return an instance of the class for the landing page.
        const { email, password } = params

        await this.emailField.fill(email)
        await this.passwordField.fill(password)
        await this.submitButton.click()
    }
}