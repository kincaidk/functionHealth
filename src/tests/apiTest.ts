import axios from 'axios'
import { createNewMember, getToken } from '../functions/apiRequests';
import { TOKEN_TYPE } from '../constants/tokenType';
import { URLS } from '../constants/urls';

async function main() {
    const { validate: isUUID } = await import('uuid');

    // Generate token
    const email: string = `Kellenceo+${Date.now()}@gmail.com`
    const password: string = "Testtest0"
    const tokenResponse = await getToken(email, password)

    // Make sure token was generated
    const tokenType: string = TOKEN_TYPE.ACCESS!
    const aTokenWasGenerated: boolean = 'data' in tokenResponse && tokenType in tokenResponse.data && tokenResponse.data[tokenType].length > 0
    if (aTokenWasGenerated) {
        const token = tokenResponse.data[tokenType]
        const headers = {
            'authorization': `Bearer ${token}`
        }

        // Create new member
        const firstName: string = "KellenTest"
        const lastName: string = "Test"
        const phoneNumber: string = "+1 301-654-6546"
        const memberCreationResponse = await createNewMember({ firstName, lastName, email, password, phoneNumber })

        console.log(`email: ${email}`)

        // Make sure member was generated
        const memberIdSuccessfullyGenerated: boolean = 'data' in memberCreationResponse && isUUID(memberCreationResponse.data)
        if (!memberIdSuccessfullyGenerated) {
            throw(`!!! Error: Failed to generate proper member ID. Generated this: ${memberCreationResponse.data}`)
        }

        // console.log("memberCreationResponse")
        // console.log(memberCreationResponse)

        const memberId: string = memberCreationResponse.data

        const payload = {
            stage: "SCAN_SELECTION_PAGE",
            memberId
        }
        // const bookingStageResponse = await axios.post(URLS.MEMBERS_BOOKING_STAGE!, payload, { headers })
        // console.log("bookingStageResponse")
        // console.log(bookingStageResponse)

        const response = await axios.get(URLS.ALL_DATA!, { headers })
        console.log(response)
    } else {
        throw("Uh oh, no token :(")
    }
}

main() // uh oh, I got all the member's data