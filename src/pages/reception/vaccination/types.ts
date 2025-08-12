import { Gender } from "~/constants/enums";

// TODO: refactor this type
export interface PatientReceptionFormValue {
    patientId?: number;
    code: string;
    name: string;
    gender: Gender;
    dob: Date;
    email: string;
    phoneNumber: string;
    identityCard: string;
    addressDetail: string;
    province: string;
    district: string;
    ward: string;
    isPregnant: boolean;
    isForeigner: boolean;
    receptionDate: Date;
    serviceTypeId: number;
}

export enum TestExaminationGroupType {
    SERVICE_GROUP = "servicegroup",
    DISEASE_GROUP = "diseasegroup",
}
export interface TestExaminationIndicationFormValue {
    receptionId: number;
    services: {
        serviceId: number;
        quantity: number;
    }[];
    serviceId?: number;
    groupId: number;
    defaultQuantity: number;
}

export interface VaccinationPrescreeningFormValue {
    id?: number;
    parentFullName: string;
    parentPhoneNumber: string;
    weightKg: number;
    bodyTemperatureC: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    hasSevereFeverAfterPreviousVaccination: boolean;
    hasAcuteOrChronicDisease: boolean;
    isOnOrRecentlyEndedCorticosteroids: boolean;
    hasAbnormalTemperatureOrVitals: boolean;
    hasAbnormalHeartSound: boolean;
    hasHeartValveDisorder: boolean;
    hasNeurologicalAbnormalities: boolean;
    isUnderweightBelow2000g: boolean;
    hasOtherContraindications: boolean;
    isEligibleForVaccination: boolean;
    isContraindicatedForVaccination: boolean;
    isVaccinationDeferred: boolean;
    isReferredToHospital: boolean;
    hasAbnormalCry: boolean;
    hasPaleSkinOrLips: boolean;
    hasPoorFeeding: boolean;
    isPretermBelow34Weeks: boolean;
    hasImmunodeficiencyOrSuspectedHiv: boolean;
}
