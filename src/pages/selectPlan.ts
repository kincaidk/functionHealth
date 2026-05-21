import { Page, Locator } from '@playwright/test'
import { ScheduleScanPage } from './scheduleScanPage'
import { YesNoMode, YesNoQuestions } from '../components/yesNoQuestions'
import { WereSorryModal } from '../components/wereSorryModal'

export enum Sex {
    Male,
    Female,
}

export enum Scan {
    MriScan,
    MriScanWithSpine,
    MriScanWithSkeletalAndNeurologicalAssessment,
    HeartCtScan,
    LungsCtScan,
}

export class SelectPlanPage {
    readonly page: Page
    readonly selectYourScanHeading: Locator
    
    // Member details
    readonly dateOfBirthField: Locator
    readonly sexAtBirthCombobox: Locator
    readonly maleSexOption: Locator
    readonly femaleSexOption: Locator

    // Primary scans
    readonly mriScanCard: Locator
    readonly mriScanWithSpineCard: Locator
    readonly mriScanWithSkeletalAndNeurologicalAssessmentCard: Locator
    readonly primaryHeartCtScanCard: Locator
    readonly primaryLungsCtScanCard: Locator

    // Add-ons
    readonly addOnHeartCtScanCard: Locator
    readonly addOnLungsCtScanCard: Locator

    // Yes/No Questions component
    readonly yesNoQuestions: YesNoQuestions

    // We're sorry modal component
    readonly wereSorryModal: WereSorryModal

    // Page navigation
    readonly continueButton: Locator
    readonly cancelButton: Locator

    constructor(page: Page) {
        this.page = page
        this.selectYourScanHeading = page.getByRole('heading', { name: 'Select your Scan' })

        this.dateOfBirthField = page.getByRole('textbox', { name: 'Date of birth (MM-DD-YYYY)' })
        this.sexAtBirthCombobox = page.getByText( 'What was your sex at birth?' ).locator('..').getByRole('combobox')
        this.maleSexOption = page.getByRole('option', { name: /^Male/ })
        this.femaleSexOption = page.getByRole('option', { name: /^Female/ })

        // Primary scans
        this.mriScanCard = page.getByTestId('FB30-encounter-card')
        this.mriScanWithSpineCard = page.getByTestId('FB60-encounter-card')
        this.mriScanWithSkeletalAndNeurologicalAssessmentCard = page.getByTestId('BLUEPRINTNR-encounter-card')
        this.primaryHeartCtScanCard = page.getByTestId('GATEDCAC-encounter-card')
        this.primaryLungsCtScanCard = page.getByTestId('LUNG-encounter-card')
        
        // Add-ons
        this.addOnHeartCtScanCard = page.getByTestId('gatedcac-addon-card')
        this.addOnLungsCtScanCard = page.getByTestId('lung-addon-card')

        // Yes/No Questions component
        this.yesNoQuestions = new YesNoQuestions(page)

        // We're sorry modal component
        this.wereSorryModal = new WereSorryModal(page)

        // Page navigation
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

    async enterBirthDate(birthDate: string): Promise<void> {
        await this.dateOfBirthField.fill(birthDate)
    }

    async chooseSexAtBirth(sex: Sex): Promise<void> {
        await this.sexAtBirthCombobox.click()

        let sexLocator: Locator
        switch(sex) {
            case Sex.Male:
                sexLocator = this.maleSexOption
                break
            case Sex.Female:
                sexLocator = this.femaleSexOption
                break
            default:
                throw(`Unrecognized sex: ${sex}`) // Shouldn't be possible but doing it anyway.
        }

        await sexLocator.click()
    }

    async choosePrimaryScan(scan: Scan): Promise<void> {
        let scanLocator: Locator
        switch(scan) {
            case Scan.MriScan:
                scanLocator = this.mriScanCard
                break
            case Scan.MriScanWithSpine:
                scanLocator = this.mriScanWithSpineCard
                break
            case Scan.MriScanWithSkeletalAndNeurologicalAssessment:
                scanLocator = this.mriScanWithSkeletalAndNeurologicalAssessmentCard
                break
            case Scan.HeartCtScan:
                scanLocator = this.primaryHeartCtScanCard
                break
            case Scan.LungsCtScan:
                scanLocator = this.primaryLungsCtScanCard
                break
            default:
                throw(`Unrecognized scan: ${scan}`) // Shouldn't be possible but doing it anyway.
        }

        await scanLocator.click()
    }

    async chooseAddOns(params: { includeHeartScanAddOn: boolean, includeLungsScanAddOn: boolean }): Promise<void> {
        const { includeHeartScanAddOn = false, includeLungsScanAddOn = false } = params

        if (includeHeartScanAddOn && await this.addOnHeartCtScanCard.isVisible()) {
            await this.addOnHeartCtScanCard.click()
        }

        if (includeLungsScanAddOn && await this.addOnLungsCtScanCard.isVisible()) {
            await this.addOnLungsCtScanCard.click()
        }
    }

    async continue(yesNoMode: YesNoMode): Promise<ScheduleScanPage> {
        await this.continueButton.click()

        // These seem to only show up if a heart scan was selected.
        const yesNoQuestionsArePresent: boolean = await this.yesNoQuestions.noChestSymptomsButton.isVisible()
        if (yesNoQuestionsArePresent) {
            await this.yesNoQuestions.answerYesNoQuestions(yesNoMode)
        }

        const wereSorryModalIsPresent: boolean = await this.wereSorryModal.continueWithoutHeartCalcium.isVisible()
        if (wereSorryModalIsPresent) {
            await this.wereSorryModal.clickContinueWithoutHeartCalcium()
        }

        const scheduleScanPage: ScheduleScanPage = new ScheduleScanPage(this.page, 'New York')
        await scheduleScanPage.waitForPageToLoad()

        return scheduleScanPage
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click()
        // TODO - Not super necessary for the assignment, but -> add validation for landing on the homepage. 
    }
}




