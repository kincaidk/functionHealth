import { Page, Locator } from '@playwright/test'
import { ReserveAppointmentPage } from './reserveAppointment'

export class ScheduleScanPage {
    readonly page: Page
    readonly scheduleYourScanHeading: Locator

    readonly stateCombobox: Locator
    readonly stateOption: Locator
    readonly robotNikTestingCenterLocation: Locator
    // readonly firstAvailableDate: Locator
    readonly timesHeaderText: Locator
    // readonly firstAvailableAppointmentTime: Locator
    readonly appointmentTimeOptions: Locator
    readonly pleaseSelect3TimesYouAreAvailableText: Locator
    readonly iUnderstandButton: Locator
    // readonly appointment1Text: Locator
    // readonly appointment2Text: Locator

    readonly backButton: Locator
    readonly continueButton: Locator

    // numberOfAppointmentTimesSelected: number = 0

    constructor(page: Page, state: 'All Available'|'Alaska'|'California'|'Florida'|'New Jersey'|'New York') {
        this.page = page
        this.scheduleYourScanHeading = page.getByRole('heading', { name: 'Schedule your scan' })

        this.stateCombobox = page.getByText('State').locator('..').getByRole('combobox')
        this.stateOption = page.getByRole('option', { name: state })
        this.robotNikTestingCenterLocation = page.getByText('RobotNik Testing Center')
        // this.firstAvailableDate = page.locator('.vuecal__cell:not(.vuecal__cell--disabled)').first() // NOTE: All dates have the class "vuecal__cell", but disabled dates have the class "vuecal__cell--disabled".
        this.timesHeaderText = page.getByText('The time(s) are displayed in')
        this.appointmentTimeOptions = page.locator('.appointments__individual-appointment')/*.getByRole('checkbox')*/.filter({ visible: true }) // NOTE: The times are actually checkboxes behind the scenes.
        
        this.pleaseSelect3TimesYouAreAvailableText = page.getByRole('heading', { name: 'Please select 3 times you are available' })
        this.iUnderstandButton = page.getByRole('button', { name: 'I understand' })
        // this.appointment1Text = page.getByText('Appointment 1')
        // this.appointment2Text = page.getByText('Appointment 2')

        this.backButton = page.locator('[data-test="cancel"]')
        this.continueButton = page.locator('[data-test="submit"]')
    }

    // async findAppointmentText(appointmentNumber: number): Promise<Locator> {
    //     return this.page.getByText(`Appointment ${appointmentNumber}`)
    // }

    findCalendarForAppointment(appointmentNumber: number): Locator {
        return this.page.locator('.datepicker').nth(appointmentNumber - 1)
    }

    findFirstAvailableDateOfAppointment(appointmentNumber: number): Locator {
        // const apppointmentText: Locator = await this.findAppointmentText(appointmentNumber)

        //testing
        // console.log(`Visibility of apppointmentText (appointment ${appointmentNumber}): ${await apppointmentText.isVisible()}`)

        // return apppointmentText.locator('..').locator('.vuecal__cell:not(.vuecal__cell--disabled)').first()
        return this.findCalendarForAppointment(appointmentNumber).locator('.vuecal__cell:not(.vuecal__cell--disabled)').first()
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

    // async selectFirstAvailableDate(): Promise<void> {
    //     await this.firstAvailableDate.click()
    // }

    // async selectFirstAvailableAppointmentTime(): Promise<void> { // TODO - See what happens if this time is the final time of the selected date. (Does the next available date get auto-selected? Or do i need to select it?)
    //     await this.firstAvailableAppointmentTime.click()
    //     await this.clickTheIUnderstandButtonIfNecessary()
    // }

    // TODO - For some reason, the times aren't getting clicked.
    async selectAppointmentDatesAndTimes(appointmentNumber: number, numberOfAppointmentsNeeded: number = 3): Promise<void> {
        let numberOfAppointmentTimesSelected: number = 0
        for (let j = 0; j < numberOfAppointmentsNeeded; j++) {
            // await this.selectFirstAvailableDate()
            const firstAvailableDate: Locator = this.findFirstAvailableDateOfAppointment(appointmentNumber)

            //testing
            console.log(`Visibility of firstAvailableDate (appointment ${appointmentNumber}): ${await firstAvailableDate.isVisible()}`)

            await firstAvailableDate.click()

            const count: number = await this.appointmentTimeOptions.count()

            //testing
            console.log(`appointmentTimeOptions count: ${count}`)

            for (let i = 0; i < count; i++) {
                const availableAppointmentTime: Locator = this.appointmentTimeOptions.nth(i)

                //testing
                console.log(`Visibility of availableAppointmentTime ${i}: ${await availableAppointmentTime.isVisible()}`)

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

    // async appointment2CalendarIsPresent(): Promise<boolean> {
    //     return await this.appointment2Text.isVisible()
    // }

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


