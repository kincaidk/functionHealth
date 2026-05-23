import { StringMap } from "../constants/stringMap";

export const URLS: StringMap = {
    ALL_DATA: "https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/6942/data",
    CAC: "https://stage-api.ezra.com/diagnostics/api/medicaldata/prescreening/cac",
    ENCOUNTER: "https://stage-api.ezra.com/api/encounter",
    LICENSED_STATES: "https://stage-api.ezra.com/individuals/api/users/getLicensedStates",
    MEMBERS: "https://stage-api.ezra.com/individuals/api/members",
    MEMBERS_BOOKING_STAGE: "https://stage-api.ezra.com/individuals/api/members/bookingstage",
    NOT_ELIGIBLE: "https://stage-api.ezra.com/packages/api/encounter/me/create/noteligible",
    TOKEN: "https://stage-api.ezra.com/individuals/member/connect/token",
}