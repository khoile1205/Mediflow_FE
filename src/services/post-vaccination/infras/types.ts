import { Gender } from "~/constants/enums";

export interface PostVaccinationPatient {
    receptionId: number;
    patientName: string;
    yearOfBirth: string;
    gender: Gender;
    patientCode: string;
    patientVaccinationCode: string;
}

export interface PostVaccinationMedicine {
    vaccinationId: number;
    medicineName: string;
    quantity: number;
    vaccinationDate: string;
    observationConfirmed: boolean;
    reactionDate: string | null;
}

export interface UpdatePostVaccinationRequest {
    id: number;
    observationConfirmed: boolean;
    hasReaction: boolean;
    reactionDate?: string | null;
    postVaccinationResult: string;
    postVaccinationDate: string;
    hasFeverAbove39: boolean;
    hasInjectionSiteReaction: boolean;
    hasOtherReaction: boolean;
    otherReactionDescription?: string | null;
}
