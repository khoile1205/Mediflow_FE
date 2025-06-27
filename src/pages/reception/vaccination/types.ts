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
    isPregnant: false;
    isForeigner: false;
    receptionDate: Date;
    serviceTypeId: number;
}

export enum TestExaminationGroupType {
    SERVICE_GROUP = "servicegroup",
    DISEASE_GROUP = "diseasegroup",
}
export interface TestExaminationIndicationFormValue {
    receptionId: number;
    services: number[];
    groupId: number;
    defaultQuantity: number;
}
