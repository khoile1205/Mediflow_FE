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
        isPregnant: boolean;
        isForeigner: boolean;
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
    vaccinations: ReceptionVaccinationService[];
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
export interface ReceptionVaccinationService {
    id: number;
    requestNumber: string;
    vaccineId: number;
    vaccineTypeName: string;
    vaccineName: string;
    quantity: number;
    unitPrice: number;
    createdAt: Date;
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
    hasAbnormalCry: boolean;
    hasPaleSkinOrLips: boolean;
    hasPoorFeeding: boolean;
    isPretermBelow34Weeks: boolean;
    hasImmunodeficiencyOrSuspectedHiv: boolean;
    receptionId: number;
}

export interface VaccinationPrescreeningResponse extends VaccinationPreScreeningRequest {
    id: number;
    createdBy: number;
    lastUpdatedBy: number;
    createdAt: string;
    lastUpdatedAt: string;
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

export interface VaccinationIndicateReception {
    id: number;
    appointmentDate: Date;
    vaccineId: number;
    vaccineName?: string;
    vaccineTypeName?: string;
    isConfirmed: boolean;
    note?: string;
    invoiceDate: Date;
    quantity: number;
    testResultEntry?: string;
    status: PaymentStatus;
    receptionId: number;
    scheduledDate: Date;
    isReadyToUse: boolean;
    doctorId: number;
    requestNumber: string;
    unitPrice: number;
}

export enum PaymentStatus {
    NotPaid,
    Paid,
    Refunded,
    AdjustedOut,
}

export interface AddVaccinationIndicateReceptionRequest {
    receptionId: number;
    vaccineId: number;
    quantity: number;
    isReadyToUse: boolean;
    scheduledDate?: Date;
    appointmentDate: Date;
    note?: string;
}

export interface UpdateVaccinationIndicateReceptionRequest {
    id: number;
    quantity: number;
    isReadyToUse: boolean;
    scheduledDate?: Date;
    appointmentDate: Date;
    note?: string;
}

export interface IPatientReception {
    id: number;
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
}

export interface AvailablePatientReceptionResponse {
    receptionId: number;
    receptionDate: Date;
    lastUpdatedAt: Date;
    serviceTypeId: number;
    patient: IPatientReception;
}

export interface AvailablePatientReception extends IPatientReception {
    receptionId: number;
    receptionDate: Date;
    lastUpdatedAt: Date;
    serviceTypeId: number;
}
