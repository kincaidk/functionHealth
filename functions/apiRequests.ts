import axios from 'axios'
import { URLS } from '../constants/urls'

export async function getToken(email: string, password: string) {
    const payload = new URLSearchParams({
        grant_type: "password",
        scope: "openid offline_access profile roles email",
        username: email,
        password,
        client_id: "F59A84B4-6E6B-4678-97A0-11C0F6E0719F"
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

export async function createNewMember(params: {
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