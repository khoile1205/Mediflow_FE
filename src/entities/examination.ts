import { BaseEntity } from "./base.entity";

export interface Examination extends BaseEntity {
    examinationId: number;
    patientId: number;
    diagnose: string;
    returnTime: Date;
    performTechnicianId: number;
    sampleType: SampleType;
    sampleQuality: SampleQuality;
    doctorId: number;
    conclusion: string;
    note: string;
    examinationResults: ExaminationResult[];
}

export interface ExaminationResult {
    parameterName: string;
    unit: string;
    resultValue: string;
    standardValue: string;
}

export interface ServiceTestParameter {
    requestNumber: string;
    parameterName: string;
    result: string;
    standardValue: string;
    unit: string;
    specimenType: string;
    equipmentName: string;
}

export interface PatientForExamination {
    receptionId: number;
    patientId: number;
    patientName: string;
    yearOfBirth: number;
    patientCode: string;
    age: number;
    gender: string;
}

export interface ExaminationOfReception {
    examinationId: number;
    serviceName: string;
}

export interface ExaminationTechnician {
    id: number;
    name: string;
}

export enum SampleType {
    BLOOD,
    FLUID,
    URINE,
    SEMEN,
    FLUID_URINE,
    FLUID_BLOOD,
    BLOOD_URINE,
    FLUID_URINE_BLOOD,
}

export enum SampleQuality {
    HIGH,
    MEDIUM,
    LOW,
}
