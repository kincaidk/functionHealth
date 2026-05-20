import { StringMap } from "./stringMap";

export const URLS: StringMap = {
    ALL_DATA: "https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/6942/data",
    CAC: "https://stage-api.ezra.com/diagnostics/api/medicaldata/prescreening/cac", // POST -> 
    // {
        // data: {
            // cacPacemaker:"no",
            // cacStent: "",
            // cacSymptoms:"no",
            // coronaryHistory: "no",
            // gatedCacStent: "no",
            // isRejected: true,
            // previousCacScoreOver400: "yes",
            // previousCacScoreThreeYears: "no",
        // },
        // encounter: {
            // encounterId: "9c376b17-4671-444e-a193-8e530b7969f9",
            // memberId: "0ff2dcdc-5081-426e-8acf-ebde6128e377",
        // }
    // }
    ENCOUNTER: "https://stage-api.ezra.com/api/encounter",
    LICENSED_STATES: "https://stage-api.ezra.com/individuals/api/users/getLicensedStates",
    MEMBERS: "https://stage-api.ezra.com/individuals/api/members",
    MEMBERS_BOOKING_STAGE: "https://stage-api.ezra.com/individuals/api/members/bookingstage",
    NOT_ELIGIBLE: "https://stage-api.ezra.com/packages/api/encounter/me/create/noteligible",
    TOKEN: "https://stage-api.ezra.com/individuals/member/connect/token",
}