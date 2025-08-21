export interface PreExaminationMedicine {
    receptionVaccinationId: number;
    patientName: string;
    vaccineName: string;
    isConfirmed: boolean;
    vaccinationTestDate: string;
    vaccineId?: number;
    testResultEntry: string;
    doctorName: string;
}

export interface UpdatePreExaminationRequest {
    receptionVaccinationId: number;
    testEntryResult: string;
}
