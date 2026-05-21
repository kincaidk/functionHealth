import { Page, Locator } from '@playwright/test'

export class ScheduleScanPage {
    readonly page: Page
    readonly scheduleYourScanHeading: Locator

    // TODO - fill out vars


    constructor(page: Page) {
        this.page = page
        this.scheduleYourScanHeading = page.getByRole('heading', { name: 'Schedule your scan' })

        // TODO - assign vars' values
    }

    async goTo() {
        await this.page.goto('https://myezra-staging.ezra.com/sign-up/schedule-scan')
        await this.waitForPageToLoad()
    }

    async waitForPageToLoad(): Promise<void> {
        await this.scheduleYourScanHeading.waitFor({ state: 'visible' })
    }

    // TODO - Make necessary methods
}


