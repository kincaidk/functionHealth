# functionHealth
Function Health interview repo

## QUESTION 1
### Part 1 - Test cases
- `Select your Scan` page
    - (1) Verify that the `Click here` link opens a tab at the correct URL.
    - (2) Check unexpected date formats for the `Date of birth` field. Verify that the only acceptable one is indeed MM-DD-YYYY. Make sure that the chosen data persits where appropriate.
    - (3) `Sex at birth?` -> Make sure that all options can be selected and that the data from the selected options persists where appropriate.
    - (4) Age must be 18yrs or older. Check ages 18yr, 18yr + 1day, 18yr - 1day. Do this for all sexes.
    - (5) 35yrs of age seems to be the cut-off for `Heart CT Scan` and `Lungs CT Scan`. Verify that this is true for both the scan and add-on versions of these.
    - (6) Verify that only 1 scan can be enabled at once, but any amount of add-ons can be enabled at once.
- `Schedule your scan`
    - (7) After selecting a state from the state dropdown menu -> verify that every address that appears is in that state. Also click the `View on map` button and verify that Google Maps opened in a new tab and searched the correct address.
    - (8) Verify that the `Additional Scheduling Information` text field can be typed in AND can hold 250 characters (which seems to be its limit).
    - (9) Verify that, until 3 timeslots are chosen for an appointment, that appointment's calendar is present and only eligible dates can be selected. When an eligible date is selected, the available timeslots for that date will be present and they can be selected and deselected.
    - (10) Verify that the earliest possible date for `Appointment 2`  is AFTER the most-future date for `Appointment 1`.
    - (11) Verify that all eligible appointment dates and times are in the future.
- `Reserve your appointment`
    - (12) Verify that the div with the booking details contains the correct data.
    - (13) Each Check-out type works:
        - (13a) `Card` -> Verify that each field can be filled out and that the `Link Terms` and `Privacy Policy` links work as expected.
        - (13b) `Bank` -> Verify that searching for a bank works as expected. Also verify that searching for a non-existent bank yields no results.
        - (13c) `Google Pay` -> Click `Continue` and verify that a Google Pay popup appears with the correct price and that it can be paid.
        - (13d) `Affirm` -> Click `Continue` and verify that the page navigates to the `Affirm` page and that the `Purchase amount` is correct.
- Misc
    - (14) Verify that the `Back` button works on every page.
    - (15) Verify that the `Continue` button works on every page, including after the `Back` button has been pressed.

### Part 2 - Test case ordering (most-important to least-important)
- 4 - If we accidentally allow minors to book scans, that would cause legal problems.
- 15 - member experience is key. If the `Continue` button doesn't work, then the member can't complete the booking process. Their frustration will damage our reputation.
- 13 - member experience is key. If the member is prevented from paying, then they can't complete the booking process. Their frustration will damage our reputation.
- 11
- 12
- 9
- 6
- 7
- 3
- 14
- 10
- 8
- 1
- 2
- 5


## QUESTION 2
### Part 1 - Integration test case that prevents members from accessing other’s medical data
BACKGROUND
During the Medical Questionnaire, many private questions are asked to the member.
If the member copies their URL and opens it in a new tab, it will load the questionnaire and return them to the page that they were last on.
This URL contains a portion that looks like this: `&extraData={"encounterId":"f1dced02-6db2-41f0-9898-94035b301f32"}`.
Each member has their own `encounterId`.

TEST CASE
Given `memberA` is doing their questionnaire.
Given `memberB` is doing their questionnaire.
When `memberA` replaces the `encounterId` in their URL with `memberB's` `encounterId`.
Then `memberA` should be denied access. This protects against horizontal privilege escalation.

Otherwise, `memberA` would be able to see `memberB's` questionnaire data, which would be a breach of privacy.

### Part 2 - HTTP requests
The scenario below is conceptually similar to the test case in part 1.

```
//// FUNCTIONS ////
async function getToken(email: string, password: string) {
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
            "https://stage-api.ezra.com/individuals/member/connect/token", payload, { headers },
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
    const memberCreationResponse = await axios.post(
        "https://stage-api.ezra.com/individuals/api/members", payload, { headers }
    )
    return memberCreationResponse
}
/////// END OF FUNCTIONS ///////

// Member data
const memberAEmail = "memberA@gmail.com"
const memberBEmail = "memberB@gmail.com"
const password = "Testtest0"
const firstName: string = "Test"
const lastName: string = "Test"
const phoneNumber: string = "+1 301-654-6546"

// Create 2 different tokens.
const memberAToken = (await getToken(memberAEmail, password)).data.access_token
const memberBToken = (await getToken(memberBEmail, password)).data.access_token

// Use those tokens to create authorization headers
const memberAHeaders = const headers = {
    'authorization': `Bearer ${memberAToken}`
}
const memberBHeaders = const headers = {
    'authorization': `Bearer ${memberBToken}`
}

// Create 2 members
const memberAId = (await createNewMember({
    firstName,
    lastName,
    memberAEmail,
    password,
    phoneNumber,
})).data
const memberBId = (await createNewMember({
    firstName,
    lastName,
    memberBEmail,
    password,
    phoneNumber,
})).data

// Attempt to retrieve those members' data, but with mismatching tokens.
const memberBTokenForMemberAData = getMemberData(memberAId, memberBToken)   // <- Pseudo code
const memberATokenForMemberBData = getMemberData(memberBId, memberAToken)   // <- Pseudo code

// Expect forbidden access on both attempts.
expect(memberBTokenForMemberAData.status).toBe(403)
expect(memberATokenForMemberBData.status).toBe(403)
```

### Part 3 - Managing the security quality of the endpoints
I gathered some exposed endpoints and used them to generate members and retrieve member data.
To prevent this sort of thing from getting too out of hand, I would focus primarily on:
- Strong authentication and authorization practices. Who are you and what are you allowed to do?
    - `Trade-offs/risks`: While bad actors will have a tougher time, so will the people who are meant to have access since both parties will encounter the strengthened authentication and authorization practices.
- Least-privilege access controls. Giving tokens the bare-minimum to reduce risk of exposure.
    - `Trade-offs/risks`: Making each token have the bare-minimum access required will minimize the risk of catastrophe by preventing a single token from being sufficient to authorize the use of all endpoints, but also could become cumbersome due to the drastic increase in token generation and the added overhead of having to specify every token's privileges.