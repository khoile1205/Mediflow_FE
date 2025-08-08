import { BaseEntity } from "./base.entity";

export interface MedicineBatch extends BaseEntity {
    medicineBatchId: number;
    medicineCode: string;
    medicineName: string;
    supplierId: number;
    supplierName: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    unit: string;
    batchNumber: string;
    expiryDate: string;
    currentQuantity: number;
}
