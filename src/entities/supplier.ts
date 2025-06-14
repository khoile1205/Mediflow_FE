export interface Supplier {
    id: number;
    supplierCode: string;
    supplierName: string;
    address: string;
    phone: string;
    fax: string;
    email: string;
    taxCode: string;
    director: string;
    contactPerson: string;
    normalizedName: string;
    isSuspended: boolean;
    isCancelled: boolean;
    createdAt: Date;
    createdBy: number;
    lastUpdatedAt: Date;
    lastUpdatedBy: number;
}
