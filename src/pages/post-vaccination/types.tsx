export interface PostVaccinationRequest {
    vaccinationNumber: string;
    injectionCompleteTime: string | Date;
    confirmFollowUp: boolean;
    testResult: "positive" | "negative";
    reactionOccurred: boolean;
    reactionAfterInjectionTime?: string | Date;
    commonReactions?: string[];
    otherSymptoms?: string;
    details: ReactionDetail[];
}

export interface ReactionDetail {
    no: number;
    vaccineName: string;
    batchCode: string;
    quantity: number;
    injectionDate: string | Date;
    followUpStatus: string;
    reactionDate?: string | Date;
    doctor?: string;
}
