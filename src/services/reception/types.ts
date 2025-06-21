import { Gender } from "~/constants/enums";

export interface PatientReceptionRequest {
    createPatientCommand: {
        code: string;
        name: string;
        gender: Gender;
        dob: Date;
        phoneNumber: string;
        identityCard: string;
        addressDetail: string;
        province: string;
        district: string;
        ward: string;
        isPregnant: false;
        isForeigner: false;
    };
    createReceptionDTO: {
        patientId: number;
        receptionDate: Date;
        serviceTypeId: number;
    };
    patientId?: number;
}
