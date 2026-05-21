import { Page, Locator } from '@playwright/test'

export class WereSorryModal {
    readonly page: Page

    readonly backButton: Locator
    readonly continueWithoutHeartCalcium: Locator

    constructor(page: Page) {
        this.page = page

        this.backButton = page.getByRole('button', { name: 'Back' })
        this.continueWithoutHeartCalcium = page.getByRole('button', { name: 'Continue Without Heart Calcium' })
    }

    async clickBack() {
        await this.backButton.click()
    }

    async clickContinueWithoutHeartCalcium() {
        await this.continueWithoutHeartCalcium.click()
    }
}

