import { Gender } from "~/constants/enums";

export interface PatientFormValue {
    receptionId?: number;
    patientCode: string;
    patientName: string;
    dateOfBirth: string;
    gender: Gender;
    weightKg: number;
    patientVaccinationCode: string;
}

export interface VaccinationFormValue {
    patientId?: number;
    receptionVaccinationId?: number;
    medicineId?: number;
    medicineName?: string;
    medicineBatchId?: number;
    medicineBatchCode?: string;
    medicineExpiryDate?: string;
    medicineBatchNumber?: string;
    isInjected?: boolean;
    isRejected?: boolean;
    testResult?: string;
    startTestingTime: Date;
    isRequiredTesting?: boolean;
    injectionDate: Date;
    note?: string;
    doctorId?: number;
}

export interface AddVaccineToPreExaminationRequest {
    receptionId: number;
    data: number[];
}

export interface VaccinationHistoryFormValues {
    patientCode: string;
    patientVaccinationCode: string;
    patientName: string;
    gender: string;
    phoneNumber: string;
    addressDetail: string;
    ward: string;
    district: string;
    province: string;
    vaccinationHistoryItems: VaccinationHistoryItem[];
}

export interface VaccinationHistoryItem {
    id: number;
    medicineTypeName: string;
    medicineName: string;
    doseNumber: string;
    vaccinationTestDate: Date;
    vaccinationDate: Date;
    vaccinationConfirmation: boolean;
    doctorName: string;
}

export interface RejectVaccinationFormValues {
    issueNote: string;
}
