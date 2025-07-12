import { PaymentStatus } from "~/services/reception/infras/types";

export interface UnpaidPatientSummary {
    id: number;
    code: string;
    name: string;
    dob: Date;
}

export interface GetPatientPaymentsResponse {
    patientId: number;
    payments: PaymentResponse[];
}

export interface PaymentResponse {
    id: number;
    receptionId: number;
    totalAmount: number;
    method: PaymentStatus;
    note?: string;
    atmTransactionCode?: string;
    paymentType: string;
    invoiceNumber?: string;
    status?: string;
    originalPaymentId?: number;
    createdAt: Date;
    lastUpdatedAt: Date;
}

export interface GetPaymentDetailsResponse {
    payment: PaymentResponse;
    paymentDetails: PaymentDetailResponse[];
}

export interface PaymentDetailResponse {
    id: number;
    paymentId: number;
    receptionVaccinationId?: number;
    serviceRequestDetailId?: number;
    amount: number;
    isReversed: boolean;
    createdAt: Date;
    lastUpdatedAt: Date;
    serviceCode?: string;
    serviceName?: string;
}

export interface HospitalUnpaidServicesResponse {
    services: HospitalUnpaidService[];
    vaccinations: HospitalVaccinationService[];
}

export interface HospitalUnpaidService {
    id: number;
    requestNumber: string;
    serviceId: number;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    createdAt: string;
    serviceType?: HospitalServiceType;
}
export interface HospitalVaccinationService {
    id: number;
    requestNumber: string;
    vaccineId: number;
    vaccineTypeName: string;
    vaccineName: string;
    quantity: number;
    unitPrice: number;
    createdAt: Date;
    serviceType?: HospitalServiceType;
}

export enum HospitalServiceType {
    SERVICE,
    VACCINATION,
}

export interface CreateReceiptPaymentRequest {
    receptionId: number;
    method: number;
    note?: string;
    receptionVaccinationIds?: number[];
    serviceRequestDetailIds?: number[];
}
