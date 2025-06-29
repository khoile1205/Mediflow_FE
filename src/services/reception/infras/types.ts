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

export interface VaccinationPreScreeningRequest {
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
    receptionId: number;
}

export interface VaccinationServiceReception {
    id: number;
    serviceId: number;
    quantity: number;
    unitPrice: number;
    invoiceDate: string;
    paymentStatus: string;
    requestNumber: string;
    serviceCode: string;
    serviceName: string;
}
