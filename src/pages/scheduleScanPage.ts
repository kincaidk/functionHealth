import { Page, Locator } from '@playwright/test'
import { ReserveAppointmentPage } from './reserveAppointment'

export class ScheduleScanPage {
    readonly page: Page
    readonly scheduleYourScanHeading: Locator

    readonly stateCombobox: Locator
    readonly stateOption: Locator
    readonly robotNikTestingCenterLocation: Locator
    readonly timesHeaderText: Locator
    readonly appointmentTimeOptions: Locator
    readonly pleaseSelect3TimesYouAreAvailableText: Locator
    readonly iUnderstandButton: Locator

    readonly backButton: Locator
    readonly continueButton: Locator

    constructor(page: Page, state: 'All Available'|'Alaska'|'California'|'Florida'|'New Jersey'|'New York') {
        this.page = page
        this.scheduleYourScanHeading = page.getByRole('heading', { name: 'Schedule your scan' })

        this.stateCombobox = page.getByText('State').locator('..').getByRole('combobox')
        this.stateOption = page.getByRole('option', { name: state })
        this.robotNikTestingCenterLocation = page.getByText('RobotNik Testing Center')
        this.timesHeaderText = page.getByText('The time(s) are displayed in')
        this.appointmentTimeOptions = page.locator('.appointments__individual-appointment').filter({ visible: true })
        
        this.pleaseSelect3TimesYouAreAvailableText = page.getByRole('heading', { name: 'Please select 3 times you are available' })
        this.iUnderstandButton = page.getByRole('button', { name: 'I understand' })

        this.backButton = page.locator('[data-test="cancel"]')
        this.continueButton = page.locator('[data-test="submit"]')
    }

    findCalendarForAppointment(appointmentNumber: number): Locator {
        return this.page.locator('.datepicker').nth(appointmentNumber - 1)
    }

    findAvailableDateForAppointment(params: { appointmentNumber: number, availableDateIndex?: number }): Locator {
        const { appointmentNumber, availableDateIndex = 0 } = params
        return this.findCalendarForAppointment(appointmentNumber).locator('.vuecal__cell:not(.vuecal__cell--disabled)').nth(availableDateIndex)
    }

    async goTo(): Promise<void> {
        await this.page.goto('https://myezra-staging.ezra.com/sign-up/schedule-scan')
        await this.waitForPageToLoad()
    }

    async waitForPageToLoad(): Promise<void> {
        await this.scheduleYourScanHeading.waitFor({ state: 'visible' })
    }

    async chooseState(): Promise<void> {
        await this.stateCombobox.click()
        await this.stateOption.click()
    }

    async chooseCenter(): Promise<void> {
        await this.page.waitForTimeout(1_000) // NOTE: Clicking it too soon was preventing the calendar from appearing.
        await this.robotNikTestingCenterLocation.click()
    }


    async selectAppointmentDatesAndTimes(params: { appointmentNumber: number, numberOfAppointmentsNeeded?: number }): Promise<void> {
        const { appointmentNumber, numberOfAppointmentsNeeded = 3 } = params

        let numberOfAppointmentTimesSelected: number = 0
        for (let j = 0; j < numberOfAppointmentsNeeded; j++) {
            const firstAvailableDate: Locator = this.findAvailableDateForAppointment({ appointmentNumber, availableDateIndex: j } )
            await firstAvailableDate.click()

            const count: number = await this.appointmentTimeOptions.count()
            for (let i = 0; i < count; i++) {
                const availableAppointmentTime: Locator = this.appointmentTimeOptions.nth(i)
                if (await availableAppointmentTime.isVisible()) {
                    await availableAppointmentTime.click()
                    numberOfAppointmentTimesSelected++
                    await this.clickTheIUnderstandButtonIfNecessary()

                    if (numberOfAppointmentTimesSelected === numberOfAppointmentsNeeded) {
                        break
                    }
                }
            }

            if (numberOfAppointmentTimesSelected === numberOfAppointmentsNeeded) {
                break
            }
        }

        if (numberOfAppointmentTimesSelected < numberOfAppointmentsNeeded) {
            throw(`Only found ${numberOfAppointmentTimesSelected} available appointment times. Needed ${numberOfAppointmentsNeeded}.`)
        }
    }

    async clickTheIUnderstandButtonIfNecessary(): Promise<void> {
        if (await this.iUnderstandButton.isVisible()) {
            await this.iUnderstandButton.click()
        }
    }

    async back(): Promise<void> {
        await this.backButton.click()
        // TODO - Not super necessary for the assignment, but -> add validation for landing on the Select Plan page. 
    }

    async continue(): Promise<ReserveAppointmentPage> {
        await this.continueButton.click()
        const reserveAppointmentPage: ReserveAppointmentPage = new ReserveAppointmentPage(this.page)
        return reserveAppointmentPage 
    }
}


