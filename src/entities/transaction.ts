import { PaymentMethod, PaymentStatus } from "~/constants/enums";

export interface Transaction {
    payment: PaymentTransaction;
    patient: PatientTransaction;
}

export interface TransactionDetail {
    payment: PaymentTransaction;
    paymentDetails: PaymentTransactionDetail[];
}

export interface PatientTransaction {
    id: number;
    code: string;
    name: string;
    phoneNumber: string;
    email: string;
    identityCard: string;
    gender: number;
    dob: string;
    province: string;
    district: string;
    ward: string;
    addressDetail: string;
    isPregnant: boolean;
    isForeigner: boolean;
}

export interface PaymentTransaction {
    id: number;
    receptionId: number;
    totalAmount: number;
    method: PaymentMethod;
    note: string;
    atmTransactionCode?: string;
    paymentType: string;
    invoiceNumber: string;
    status: PaymentStatus;
    originalPaymentId?: number;
    createdAt?: Date;
    lastUpdatedAt?: Date;
}

export interface PaymentTransactionDetail {
    id: number;
    paymentId: number;
    receptionVaccinationId?: number;
    serviceRequestDetailId?: number;
    amount: number;
    isReversed: boolean;
    createdAt: Date;
    lastUpdatedAt: Date;
    serviceCode: string;
    serviceName: string;
}
