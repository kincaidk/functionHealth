import { Page, Locator } from '@playwright/test'
import { SelectPlanPage } from "./selectPlan"
import { MemberTestData } from '../fixtures/memberTestData'

export class JoinPage {
    readonly page: Page
    readonly orSignUpWithYourEmailText: Locator
    readonly url: string = 'https://myezra-staging.ezra.com/join'

    readonly legalFirstNameField: Locator
    readonly legalLastNameField: Locator
    readonly emailField: Locator
    readonly phoneNumberField: Locator
    readonly passwordField: Locator
    readonly termsOfUseCheckbox: Locator
    readonly submitButton: Locator
    readonly validationErrorsAlert: Locator

    constructor(page: Page) {
        this.page = page
        this.orSignUpWithYourEmailText = page.getByText('or sign up with your email')

        this.legalFirstNameField = page.getByRole('textbox', { name: 'Legal First Name' })
        this.legalLastNameField = page.getByRole('textbox', { name: 'Legal Last Name' })
        this.emailField = page.getByRole('textbox', { name: 'Email' })
        this.phoneNumberField = page.getByRole('textbox', { name: 'Phone Number' })
        this.passwordField = page.getByRole('textbox', { name: 'Password' })
        this.termsOfUseCheckbox = page.getByRole('button', { name: 'I agree to Ezra\'s terms of use' })
        this.submitButton = page.getByRole('button', { name: 'Submit' })
        this.validationErrorsAlert = page.locator('.toast.--visible')
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url)
        await this.waitForPageToLoad()
    }

    async waitForPageToLoad(): Promise<void> {
        await this.orSignUpWithYourEmailText.waitFor({ state: 'visible' })
    }

    async signUp( memberData: MemberTestData ): Promise<SelectPlanPage> {
        const selectPlanPage: SelectPlanPage = new SelectPlanPage(this.page)
        await this.fillOutSignUpDetails(memberData)
        await this.submitButton.click()

        const navigationPromise = this.page.waitForURL(selectPlanPage.url, {
            timeout: 15000,
        }).then(() => 'navigation-successful');

        const toastPromise = this.validationErrorsAlert.waitFor({
            state: 'visible',
            timeout: 15000,
        }).then(() => 'validation-error');

        // /* 
        //     EDGE-CASE: 
        //         Sometimes, an error appears at the button of the screen when clicking the submit button.
        //         If you reload tha page and try again, it usually works that time.

        //         (See the image in the /images directory named: FunctionHealth_staging400WhenCreatingAccount.png)
        // */
        const submitButtonClickOutcome = await Promise.race([
            navigationPromise,
            toastPromise,
        ]);

        if (submitButtonClickOutcome !== 'navigation-successful') {
            console.log("Validation alert. Reloading...")

            await this.page.reload();
            await this.fillOutSignUpDetails(memberData)
            await this.submitButton.click()
        }

        await selectPlanPage.waitForPageToLoad()

        return selectPlanPage
    }

    async fillOutSignUpDetails(memberData: MemberTestData): Promise<void> {
        const { firstName, lastName, email, phoneNumber, password, } = memberData

        await this.legalFirstNameField.fill(firstName)
        await this.legalLastNameField.fill(lastName)
        await this.emailField.fill(email())
        await this.phoneNumberField.fill(phoneNumber)
        await this.passwordField.fill(password)
        await this.termsOfUseCheckbox.click()
    }
}