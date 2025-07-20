import { Patient, ResultForm, SampleType, SampleQuality } from "~/entities";

export interface ExaminationFormValue {
    patient: Patient;
    patientYearOld: number;
    patientYOB: number;
    diagnose: string;
    receiptTime: Date;
    executeTime: Date;
    performTechnicianId: number;
    performTechnicianName?: string;
    returnResultsAfter?: number; // in minutes
    appointmentTimeForResult: Date;
    resultForm: ResultForm;
    sampleType: SampleType;
    sampleQuality: SampleQuality;
    concludedDoctorId: number;
    concludedDoctorName?: string;
    receiverId: number;
    receiverName?: string;
    conclusion: string;
    note: string;
    isDiagnosed: boolean;
}
