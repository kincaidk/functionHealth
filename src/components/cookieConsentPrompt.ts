import { Page, Locator } from '@playwright/test'

export class CookieConsentPrompt {
    readonly page: Page

    readonly cookieConsentPrompt: Locator
    readonly cookieConsentButton: Locator

    constructor(page: Page) {
        this.page = page

        this.cookieConsentPrompt = page.getByRole('alertdialog', { name: 'Cookie Consent Prompt' })
        this.cookieConsentButton = this.cookieConsentPrompt.getByRole('button', { name: 'Accept' })
    }

    async acceptCookies() {
        await this.cookieConsentButton.click()
    }
}

