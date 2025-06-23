import { Gender } from "~/constants/enums";
import { TestExaminationGroupType } from "~/pages/reception/vaccination/types";

export interface PatientReceptionRequest {
    createPatientCommand: {
        code: string;
        name: string;
        gender: Gender;
        dob: Date;
        phoneNumber: string;
        identityCard: string;
        addressDetail: string;
        province: string;
        district: string;
        ward: string;
        isPregnant: false;
        isForeigner: false;
    };
    createReceptionDTO: {
        patientId: number;
        receptionDate: Date;
        serviceTypeId: number;
    };
    patientId?: number;
}

export interface ServiceReceptionRequest {
    receptionId: number;
    services: number[];
    groupType: TestExaminationGroupType;
    groupId: number;
    defaultQuantity: number;
}
