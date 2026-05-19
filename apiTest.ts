import axios from 'axios'

type StringMap = {
    [key: string]: string
}

const TOKEN_TYPE: StringMap = {
    ACCESS: "access_token",
    ID: "id_token",
    REFRESH: "refresh_token"
}

const URLS: StringMap = {
    ALL_DATA: "https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/6942/data",
    MEMBERS: "https://stage-api.ezra.com/individuals/api/members",
    TOKEN: "https://stage-api.ezra.com/individuals/member/connect/token",
    LICENSED_STATES: "https://stage-api.ezra.com/individuals/api/users/getLicensedStates",
}

async function getToken() {
    const payload = new URLSearchParams({
        "grant_type": "password",
        "scope": "openid offline_access profile roles email",
        "username": "Kellenceo+test0@gmail.com",
        "password": "Testtest0",
        "client_id": "F59A84B4-6E6B-4678-97A0-11C0F6E0719F"
    })
    
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    }
    const tokenResponse = (
        await axios.post(
            URLS.TOKEN!, payload, { headers },
        )
    )

    return tokenResponse
}

async function createNewMember(params: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    optInEmailNotifications?: boolean,
    optInPhoneNotifications?: boolean,
    legal?: string[]
}) {
    const { 
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        optInEmailNotifications = false,
        optInPhoneNotifications = false,
        legal = ["privacyPolicy", "telehealthConsent", "termsAndConditions"]
    } = params

    const headers = {
        "content-type": "application/json"
    }
    const payload = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        optInEmailNotifications,
        optInPhoneNotifications,
        legal
    }
    const memberCreationResponse = await axios.post(URLS.MEMBERS!, payload, { headers })
    return memberCreationResponse
}

async function main() {
    const { validate: isUUID } = await import('uuid');
    const tokenResponse = await getToken()

    const tokenType: string = TOKEN_TYPE.ACCESS!
    const aTokenWasGenerated: boolean = 'data' in tokenResponse && tokenType in tokenResponse.data && tokenResponse.data[tokenType].length > 0
    if (aTokenWasGenerated) {
        const token = tokenResponse.data[tokenType]
        const headers = {
            'authorization': `Bearer ${token}`
        }

        // TODO - Create new member
        const firstName: string = "KellenTest"
        const lastName: string = "Test"
        const email: string = `Kellenceo+${Date.now()}@gmail.com`
        const password: string = "Testtest0"
        const phoneNumber: string = "+1 301-654-6546"
        const memberCreationResponse = await createNewMember({ firstName, lastName, email, password, phoneNumber })

        console.log(`email: ${email}`)

        const memberIdSuccessfullyGenerated: boolean = 'data' in memberCreationResponse && isUUID(memberCreationResponse.data)
        if (!memberIdSuccessfullyGenerated) {
            throw(`!!! Error: Failed to generate proper member ID. Generated this: ${memberCreationResponse.data}`)
        }


        // const response = await axios.get(URLS.MEMBERS!, { headers })
        // console.log(response)
    } else {
        throw("Uh oh, no token :(")
    }
}

main() // uh oh, I got all the member's data