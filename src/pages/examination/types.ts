import { SampleType, SampleQuality, ServiceTestParameter } from "~/entities";

export interface ExaminationFormValue {
    examinationId: number;
    patientId: number;
    diagnose: string;
    returnResultsAfter: string; // in minutes
    returnTime: Date;
    performTechnicianId: number;
    sampleType: SampleType;
    sampleQuality: SampleQuality;
    doctorId: number;
    conclusion: string;
    note: string;
    serviceTestParameters: ServiceTestParameter[];
}
