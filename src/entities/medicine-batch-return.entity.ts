import { BaseEntity } from "./base.entity";

export interface MedicineBatchExpiredReturn extends BaseEntity {
    returnCode: string;
    reason: string;
    receiverName: string;
    receiverPhone: string;
    receiverEmail: string;
    status: number;
    approvedAt?: Date;
    rejectedAt?: Date;
    details: MedicineBatchExpiredReturnDetail[];
}

export interface MedicineBatchExpiredReturnDetail {
    id: number;
    medicineBatchId: number;
    batchNumber: string;
    expirationDate: Date;
    quantity: number;
    supplierId: number;
    supplierName: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
}
