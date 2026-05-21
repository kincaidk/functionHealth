import { Page, Locator } from '@playwright/test'

export class ScanConfirmPage {
    readonly page: Page
    readonly beingMedicalQuestionnaireButton: Locator
    readonly url: string = 'https://myezra-staging.ezra.com/sign-up/scan-confirm'

    constructor(page: Page) {
        this.page = page
        this.beingMedicalQuestionnaireButton = page.getByRole('button', { name: 'Begin Medical Questionnaire' })
    }

    
}


