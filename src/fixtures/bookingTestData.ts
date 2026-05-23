import { Scan } from "../enums/medical.enums";

export type BookingTestScenarios = {
    [key: string]: BookingTestData
}

export type BookingTestData = {
    scan: Scan,
    addOns: { 
        includeHeartScanAddOn: boolean, 
        includeLungsScanAddOn: boolean,
    }
}

// NOTE: Add-ons require the member to be at least 35 years old
export const bookingTestData: BookingTestScenarios = {
    // MRI
    mriScanNoAddOns: {
        scan: Scan.MriScan,
        addOns: { includeHeartScanAddOn: false, includeLungsScanAddOn: false }
    },
    mriScanWithHeartAddOn: {
        scan: Scan.MriScan,
        addOns: { includeHeartScanAddOn: true, includeLungsScanAddOn: false }
    },
    mriScanWithLungsAddOn: {
        scan: Scan.MriScan,
        addOns: { includeHeartScanAddOn: false, includeLungsScanAddOn: true }
    },
    mriScanWithAllAddOns: {
        scan: Scan.MriScan,
        addOns: { includeHeartScanAddOn: true, includeLungsScanAddOn: true }
    },

    // MRI with spine
    mriScanWithSpineNoAddOns: {
        scan: Scan.MriScanWithSpine,
        addOns: { includeHeartScanAddOn: false, includeLungsScanAddOn: false }
    },
    mriScanWithSpineWithHeartAddOn: {
        scan: Scan.MriScanWithSpine,
        addOns: { includeHeartScanAddOn: true, includeLungsScanAddOn: false }
    },
    mriScanWithSpineWithLungsAddOn: {
        scan: Scan.MriScanWithSpine,
        addOns: { includeHeartScanAddOn: false, includeLungsScanAddOn: true }
    },
    mriScanWithSpineWithAllAddOns: {
        scan: Scan.MriScanWithSpine,
        addOns: { includeHeartScanAddOn: true, includeLungsScanAddOn: true }
    },

    // MRI with skeletal and neurological assessment
    mriScanWithSkeletalAndNeurologicalAssessmentNoAddOns: {
        scan: Scan.MriScanWithSkeletalAndNeurologicalAssessment,
        addOns: { includeHeartScanAddOn: false, includeLungsScanAddOn: false }
    },
    mriScanWithSkeletalAndNeurologicalAssessmentWithAllAddOns: {
        scan: Scan.MriScanWithSkeletalAndNeurologicalAssessment,
        addOns: { includeHeartScanAddOn: true, includeLungsScanAddOn: true }
    },
    mriScanWithSkeletalAndNeurologicalAssessmentWithHeartAddOn: {
        scan: Scan.MriScanWithSkeletalAndNeurologicalAssessment,
        addOns: { includeHeartScanAddOn: true, includeLungsScanAddOn: false }
    },
    mriScanWithSkeletalAndNeurologicalAssessmentWithLungsAddOn: {
        scan: Scan.MriScanWithSkeletalAndNeurologicalAssessment,
        addOns: { includeHeartScanAddOn: false, includeLungsScanAddOn: true }
    },

    // Heart
    heartScan: {
        scan: Scan.HeartCtScan,
        addOns: { includeHeartScanAddOn: false, includeLungsScanAddOn: false }
    },

    // Lungs
    lungsScan: {
        scan: Scan.LungsCtScan,
        addOns: { includeHeartScanAddOn: false, includeLungsScanAddOn: false }
    },
}

