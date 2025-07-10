import { Gender } from "~/constants/enums";

export interface PostVaccinationPatient {
    no: number;
    patientName: string;
    dob: string;
    gender: Gender;
    medicalCode: string;
    vaccinationNumber: string;
    receptionId: number;
}

export interface PostVaccinationMedicine {
    no: number;
    vaccineName: string;
    batchCode: string;
    quantity: number;
    injectionDate: string;
    followUpStatus: string;
    reactionDate: string;
    doctor: string;
}

export interface UpdatePostVaccinationRequest {
    injectionCompleteTime: string;
    confirmFollowUp: boolean;
    testResult: "negative" | "positive";
    reactionOccurred: boolean;
    reactionAfterInjectionTime?: string;
    commonReactions: string[];
    otherSymptoms?: string;
}
