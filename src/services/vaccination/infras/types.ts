import { Gender } from "~/constants/enums";

export type WaitingPatientVaccination = {
    receptionId: number;
    patientId: number;
    patientCode: string;
    patientVaccinationCode: string;
    patientName: string;
    dateOfBirth: string;
    gender: Gender;
    weightKg: number;
};

export type GetMedicineListForVaccinationByReceptionIdResponse = {
    doctorPrescribedVaccines: MedicineVaccinationInformation[];
    customerWarehouseVaccines: MedicineVaccinationInformation[];
};

export type MedicineVaccinationInformation = {
    receptionVaccinationId: number;
    medicineId: number;
    medicineName: string;
    isRequiredTesting: boolean;
    isConfirmed: boolean;
    testResultEntry?: string;
    startTestingTime?: Date;
    doctorName?: string;
    vaccinationId: null;
    medicineBatchId: string;
    medicineBatchNumber: string;
};

export type GetNearestExpiryMedicineBatchResponse = {
    medicineBatches: NearestExpiryMedicineBatch[];
    requestId: string;
    requestedAt: string;
    isSuccess: boolean;
    errorMessage: string | null;
};

export type NearestExpiryMedicineBatch = {
    expiryDate: string;
    medicineBatchId: number;
    medicineBatchNumber: string;
    medicineId: number;
    medicineName: string;
};

export interface UpdateVaccinationStatusRequest {
    receptionVaccinationId: number;
    status: boolean;
}

export interface InjectVaccineRequest {
    patientId: number;
    receptionVaccinationId: number;
    medicineBatchId: number;
    batchNumber: string;
    medicineId: number;
    medicineName: string;
    note: string;
    doctorId: number;
}

type VaccinationHistoryItem = {
    id: number;
    medicineTypeName: string;
    medicineName: string;
    doseNumber: string;
    vaccinationTestDate: Date;
    vaccinationDate: Date;
    vaccinationConfirmation: boolean;
    doctorName: string;
};

export interface VaccinationHistoryResponse {
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

export interface RejectVaccinationRequest {
    receptionVaccinationId: number;
    issueNote: string;
}

export interface PendingVaccinationTodayResponse {
    totalPendingDoses: number;
    pendingVaccinations: PendingVaccination[];
}

export interface PendingVaccination {
    receptionVaccinationId: number;
    vaccineId: number;
    vaccineName: string;
    totalQuantity: number;
    completedDoses: number;
    pendingDoses: number;
    scheduledDate: Date;
}

export interface ClosingReceptionRequest {
    receptionId: number;
    issueNote: string;
    reScheduleDate: Date;
}
