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
    receptionVaccinationId?: number;
    medicineId?: number;
    medicineBatchCode?: string;
    medicineExpiryDate?: string;
    isInjected?: boolean;
    testingStartTime: Date;
    injectionDate: Date;
    note?: string;
}
