import { Page, Locator } from '@playwright/test'

export class ScanConfirmPage {
    readonly page: Page
    readonly beingMedicalQuestionnaireButton: Locator
    readonly url: string = 'https://myezra-staging.ezra.com/sign-up/scan-confirm'

    constructor(page: Page) {
        this.page = page
        this.beingMedicalQuestionnaireButton = page.getByRole('button', { name: 'Begin Medical Questionnaire' })
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url)
        await this.waitForPageToLoad()
    }

    async waitForPageToLoad(): Promise<void> {
        await this.beingMedicalQuestionnaireButton.waitFor({ state: 'visible' })
    }
}


