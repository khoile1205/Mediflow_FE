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
    isConfirmed: boolean;
    testResultEntry?: string;
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
