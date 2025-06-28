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

export interface PatientReceptionResponse {
    patientId: number;
    receptionId: number;
}

export interface ServiceReceptionRequest {
    receptionId: number;
    services: {
        serviceId: number;
        quantity: number;
    }[];
    groupType: TestExaminationGroupType;
    groupId: number;
    defaultQuantity: number;
}

export interface ReceptionUnpaidServicesResponse {
    services: ReceptionUnpaidService[];
    // vaccinations: Vaccination[]
}

export interface ReceptionUnpaidService {
    id: number;
    requestNumber: string;
    serviceId: number;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    createdAt: string;
}
