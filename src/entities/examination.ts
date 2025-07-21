import { Patient } from "./person-info.entity";
import { BaseEntity } from "./base.entity";

export interface Examination extends BaseEntity {
    patient: Patient;
    diagnose: string;
    receiptTime: Date;
    executeTime?: Date;
    performTechnicianId: number;
    appointmentTimeForResult?: Date;
    resultForm?: ResultForm;
    sampleType?: SampleType;
    sampleQuality?: SampleQuality;
    concludedDoctorId?: number;
    receiverId?: number;
    conclusion: string;
    note: string;
    isDiagnosed: boolean;
}

export enum ResultForm {
    THIRD_FLOOR_LOBBY = "thirdFloorLobby",
    SECOND_FLOOR_LOBBY = "secondFloorLobby",
    ONLINE = "online",
}

export enum SampleType {
    BLOOD = "blood",
    FLUID = "fluid",
    URINE = "urine",
    SEMEN = "semen",
    FLUID_URINE = "fluidUrine",
    FLUID_BLOOD = "fluidBlood",
    BLOOD_URINE = "bloodUrine",
    FLUID_URINE_BLOOD = "fluidUrineBlood",
}

export enum SampleQuality {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
}
