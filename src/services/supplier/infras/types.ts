export interface CreateSupplierRequest {
    supplierName: string;
    address: string;
    phone: string;
    fax?: string;
    email: string;
    taxCode?: string;
    director: string;
    contactPerson: string;
    //
    expiredDate?: Date;
    contracts?: SupplierDocumentFile[];
}

export interface SupplierDocumentFile {
    id: string;
    fileName: string;
}

export interface UpdateSupplierRequest extends CreateSupplierRequest {
    id: number;
}
