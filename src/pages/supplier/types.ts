import { UploadedFile } from "~/services/public-api/upload-file/infras";

export interface SupplierFormValues {
    supplierName: string;
    address: string;
    phone: string;
    fax?: string;
    email: string;
    taxCode?: string;
    director: string;
    contactPerson: string;
    expiredDate?: Date;
    contracts?: UploadedFile[];
}
