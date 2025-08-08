export type PatientExaminationSummary = {
    patientId: number;
    patientCode: string;
    patientName: string;
    phoneNumber: string;
    lastExaminationDate: Date;
};

export type PatientExaminationHistory = {
    patientId: number;
    patientCode: string;
    patientName: string;
    dob: Date;
    phoneNumber: string;
    returnDate: Date;
    examinationHistory: ExaminationHistory[];
};

export type ExaminationHistory = {
    examinationId: number;
    returnTime: Date;
    serviceId: number;
    serviceName: string;
    doctorName: string;
    status: string;
};

export type ExaminationHistoryDetail = {
    patientId: number;
    patientCode: string;
    patientName: string;
    patientPhoneNumber: string;
    returnDate: Date;
    serviceName: string;
    status: string;
    examinationTestParameters: ExaminationTestParameter[];
    diagnosis: string;
    conclusion: string;
    note: string;
};

export type ExaminationTestParameter = {
    parameterName: string;
    result: string;
    standardValue: string;
};
