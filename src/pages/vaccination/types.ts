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
    testResult?: string;
    testingStartTime: Date;
    isRequiredTesting?: boolean;
    injectionDate: Date;
    note?: string;
    doctorId?: number;
}

export interface AddVaccineToPreExaminationRequest {
    receptionId: number;
    data: number[];
}
