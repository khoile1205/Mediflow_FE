import { BaseEntity } from "./base.entity";
import { PatientSummary } from "./person-info.entity";

export interface Appointment extends BaseEntity {
    patient: PatientSummary;
    patientName: string;
    patientCode: string;
    patientAge: number;
    vaccineName: string;
    dose: string;
    appointmentDate: string;
    appointmentType: string;
    note?: string;
}

export interface AppointmentSummary extends BaseEntity {
    patientName: string;
    patientCode: string;
    patientAge: number;
    vaccineName: string;
    dose?: string;
    appointmentDate: Date;
    appointmentType: string;
    note?: string;
}
