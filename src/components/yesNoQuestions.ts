import { Page, Locator } from '@playwright/test'

export enum YesNoMode {
    AllYes,
    AllNo,
    Random,
}

export class YesNoQuestions {
    readonly page: Page

    // Yes/No questions
    // No...
    readonly noChestSymptomsButton: Locator
    readonly noGatedCacStent: Locator
    readonly noPaceMaker: Locator
    readonly noCoronaryHistory: Locator
    readonly noPreviousCacScoreThreeYears: Locator
    readonly noPreviousCacScoreOver400: Locator
    // Yes...
    readonly yesChestSymptomsButton: Locator
    readonly yesGatedCacStent: Locator
    readonly yesPaceMaker: Locator
    readonly yesCoronaryHistory: Locator
    readonly yesPreviousCacScoreThreeYears: Locator
    readonly yesPreviousCacScoreOver400: Locator
    // Submit
    readonly yesNoQuestionsSubmitButton: Locator

    constructor(page: Page) {
        this.page = page

        // Yes/No questions
        // No...
        this.noChestSymptomsButton = page.getByTestId('no-chest-symptoms').getByRole('button', { name: 'No' })
        this.noGatedCacStent = page.getByTestId('no-gatedCacStent').getByRole('button', { name: 'No' })
        this.noPaceMaker = page.getByTestId('no-pacemaker').getByRole('button', { name: 'No' })
        this.noCoronaryHistory = page.getByTestId('no-coronaryHistory').getByRole('button', { name: 'No' })
        this.noPreviousCacScoreThreeYears = page.getByTestId('no-previousCacScoreThreeYears').getByRole('button', { name: 'No' })
        this.noPreviousCacScoreOver400 = page.getByTestId('no-previousCacScoreOver400').getByRole('button', { name: 'No' })
        // Yes...
        this.yesChestSymptomsButton = page.getByTestId('yes-chest-symptoms').getByRole('button', { name: 'Yes' })
        this.yesGatedCacStent = page.getByTestId('yes-gatedCacStent').getByRole('button', { name: 'Yes' })
        this.yesPaceMaker = page.getByTestId('yes-pacemaker').getByRole('button', { name: 'Yes' })
        this.yesCoronaryHistory = page.getByTestId('yes-coronaryHistory').getByRole('button', { name: 'Yes' })
        this.yesPreviousCacScoreThreeYears = page.getByTestId('yes-previousCacScoreThreeYears').getByRole('button', { name: 'Yes' })
        this.yesPreviousCacScoreOver400 = page.getByTestId('yes-previousCacScoreOver400').getByRole('button', { name: 'Yes' })
        // Submit
        this.yesNoQuestionsSubmitButton = page.getByTestId('cac-prescreen-modal-submit-btn')
    }

    async answerYesNoQuestions(yesNoMode: YesNoMode) {
        switch(yesNoMode) {
            case YesNoMode.AllNo:
                await this.noChestSymptomsButton.click()
                await this.noGatedCacStent.click()
                await this.noPaceMaker.click()
                await this.noCoronaryHistory.click()
                await this.noPreviousCacScoreThreeYears.click()
                await this.noPreviousCacScoreOver400.click()
                break
            case YesNoMode.AllYes:
                await this.yesChestSymptomsButton.click()
                await this.yesGatedCacStent.click()
                await this.yesPaceMaker.click()
                await this.yesCoronaryHistory.click()
                await this.yesPreviousCacScoreThreeYears.click()
                await this.yesPreviousCacScoreOver400.click()
                break
            case YesNoMode.Random:
                await this[`${Math.random() < 0.5 ? 'no' : 'yes'}ChestSymptomsButton`].click()
                await this[`${Math.random() < 0.5 ? 'no' : 'yes'}GatedCacStent`].click()
                await this[`${Math.random() < 0.5 ? 'no' : 'yes'}PaceMaker`].click()
                await this[`${Math.random() < 0.5 ? 'no' : 'yes'}CoronaryHistory`].click()
                await this[`${Math.random() < 0.5 ? 'no' : 'yes'}PreviousCacScoreThreeYears`].click()
                await this[`${Math.random() < 0.5 ? 'no' : 'yes'}PreviousCacScoreOver400`].click()
                break
            default:
                throw(`Unrecognized yesNoMode: ${yesNoMode}`) // Shouldn't be possible but doing it anyway.
        }

        await this.yesNoQuestionsSubmitButton.click()
    }
}