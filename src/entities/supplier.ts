import { BaseEntity } from "./base.entity";

export interface Supplier extends BaseEntity {
    supplierCode: string;
    supplierName: string;
    address: string;
    phone: string;
    fax: string;
    email: string;
    taxCode: string;
    contracts: SupplierDocumentFile[];
    expiredDate?: Date;
    director: string;
    contactPerson: string;
    normalizedName: string;
}

export interface SupplierDocumentFile {
    id: string;
    fileName: string;
}
