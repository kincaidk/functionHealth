import { Sex } from "../enums/medical.enums"
import { generatePastDate } from "../functions/helpers"

export type MemberTestScenarios = {
    [key: string]: MemberTestData
}

export type MemberTestData = {
    firstName: string
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    birthDate: string,
    sexAtBirth: Sex,
}

function randomBigNumber(): number {
    return Date.now() - parseInt(randomPhoneNumberEnding())
}

function placeholderText(): string {
    return `playwright${randomBigNumber()}`
}

function randomPhoneNumberEnding(): string {
    const min: number = 1000;
    const max: number = 9999;

    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

function generateEmail(): string {
    return `playwright+${randomBigNumber()}@gmail.com`
}

function generatePhoneNumber(): string {
    return `301654${randomPhoneNumberEnding()}`
}

export const memberTestScenarios: MemberTestScenarios = {
    // 18year
    eighteenYearOld: {
        firstName: placeholderText(),
        lastName: placeholderText(),
        email: generateEmail(),
        phoneNumber: generatePhoneNumber(),
        password: "Testtest0",
        birthDate: generatePastDate({ yearsAgo: 18 }),
        sexAtBirth: Sex.Male,
    },
    eighteenYearOldPlusOneDay: {
        firstName: placeholderText(),
        lastName: placeholderText(),
        email: generateEmail(),
      phoneNumber: generatePhoneNumber(),
        password: "Testtest0",
        birthDate: generatePastDate({ yearsAgo: 18, daysAgo: 1 }),
        sexAtBirth: Sex.Female,
    },
    eighteenYearOldMinusOneDay: {
        firstName: placeholderText(),
        lastName: placeholderText(),
        email: generateEmail(),
      phoneNumber: generatePhoneNumber(),
        password: "Testtest0",
        birthDate: generatePastDate({ yearsAgo: 18, daysAgo: -1 }),
        sexAtBirth: Sex.Male,
    },

    // 35year
    thirtyFiveYearOld: {
        firstName: placeholderText(),
        lastName: placeholderText(),
        email: generateEmail(),
      phoneNumber: generatePhoneNumber(),
        password: "Testtest0",
        birthDate: generatePastDate({ yearsAgo: 35 }),
        sexAtBirth: Sex.Female,
    },
    thirtyFiveYearOldPlusOneDay: {
        firstName: placeholderText(),
        lastName: placeholderText(),
        email: generateEmail(),
      phoneNumber: generatePhoneNumber(),
        password: "Testtest0",
        birthDate: generatePastDate({ yearsAgo: 35, daysAgo: 1 }),
        sexAtBirth: Sex.Male,
    },
    thirtyFiveYearOldMinusOneDay: {
        firstName: placeholderText(),
        lastName: placeholderText(),
        email: generateEmail(),
        phoneNumber: generatePhoneNumber(),
        password: "Testtest0",
        birthDate: generatePastDate({ yearsAgo: 35, daysAgo: -1 }),
        sexAtBirth: Sex.Female,
    }
}