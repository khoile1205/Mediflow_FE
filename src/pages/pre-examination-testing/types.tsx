export interface PreExaminationRow {
    receptionVaccinationId: number;
    patientName: string;
    vaccineName: string;
    isConfirmed: boolean;
    vaccinationTestDate: string;
    testResultEntry: string;
    vaccineId: number;
    doctorName: string;
}

export interface UpdatePreExaminationRequest {
    receptionVaccinationId: number;
    testEntryResult: string;
}
