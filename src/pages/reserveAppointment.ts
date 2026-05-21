import { Page, Locator } from '@playwright/test'

export class ReserveAppointmentPage {
    readonly page: Page
    readonly reserveYourAppointmentHeading: Locator


    constructor(page: Page) {
        this.page = page
        this.reserveYourAppointmentHeading = page.getByRole('heading', { name: 'Reserve your appointment' })

        
    }


}