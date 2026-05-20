import { Page, Locator } from '@playwright/test'

export class SelectPlanPage {
    readonly page: Page
    readonly selectYourScanHeading: Locator
    
    readonly dateOfBirthField: Locator
    readonly sexAtBirthCombobox: Locator
    readonly maleSexOption: Locator
    readonly femaleSexOption: Locator
    readonly mriScanCard: Locator
    readonly mriScanWithSpineCard: Locator
    readonly mriScanWithSkeletalAndNeurologicalAssessmentCard: Locator
    readonly primaryHeartCtScanCard: Locator
    readonly primaryLungsCtScanCard: Locator

    readonly addOnHeartCtScanCard: Locator
    readonly addOnLungsCtScanCard: Locator

    readonly continueButton: Locator
    readonly cancelButton: Locator

    constructor(page: Page) {
        this.page = page
        this.selectYourScanHeading = page.getByRole('heading', { name: 'Select your Scan' })

        this.dateOfBirthField = page.getByRole('textbox', { name: 'Date of birth (MM-DD-YYYY)' })
        this.sexAtBirthCombobox = page.getByRole('combobox', { name: 'What was your sex at birth?' })
        this.maleSexOption = page.getByRole('option', { name: 'Male Select' })//.locator('span').first()
        this.femaleSexOption = page.getByRole('option', { name: 'Female Select' })//.locator('span').first()
        this.mriScanCard = page.getByText('MRI Scan', { exact: true })
        this.mriScanWithSpineCard = page.getByText('MRI Scan with Spine', { exact: true })
        this.mriScanWithSkeletalAndNeurologicalAssessmentCard = page.getByText('MRI Scan with Skeletal and Neurological Assessment', { exact: true })

        const primaryScanList: Locator = page.getByRole('list').filter({ hasText: 'MRI Scan Available at' })
        this.primaryHeartCtScanCard = primaryScanList.getByText('Heart CT Scan', { exact: true })
        this.primaryLungsCtScanCard = primaryScanList.getByText('Lungs CT Scan', { exact: true })
        
        this.addOnHeartCtScanCard = page.getByTestId('gatedcac-addon-card')
        this.addOnLungsCtScanCard = page.getByTestId('lung-addon-card')
        // const addOnScanList: Locator = page.getByRole('heading', { name: 'Select your add-on' })
        // this.addOnHeartCtScanCard = addOnScanList.getByText('Heart CT Scan', { exact: true })
        // this.addOnLungsCtScanCard = addOnScanList.getByText('Lungs CT Scan', { exact: true })

        this.continueButton = page.getByTestId('select-plan-submit-btn')
        this.cancelButton = page.getByTestId('select-plan-cancel-btn')
    }

    async goTo(): Promise<void> {
        await this.page.goto('https://myezra-staging.ezra.com/sign-up/select-plan')
        await this.waitForPageToLoad()
    }

    async waitForPageToLoad(): Promise<void> {
        await this.selectYourScanHeading.waitFor({ state: 'visible' })
    }
}


