export interface IDocumentImportMedicineSupplierResponse {
    documentCode: string;
    documentNumber: string;
}

export interface ImportMedicineFromSupplierDocumentRequest {
    documentCode: string;
    documentNumber: string;
    warehouseId: number;
    importDate: string;
    supplierId: number;
    note: string;
    receivedById: number;
    supportingDocument: string;
    endDate: string;
    details: DocumentMedicineDetail[];
}

export interface DocumentMedicineDetail {
    medicineId: number;
    batchNumber: string;
    sgk_CPNK: string;
    note: string;
    quantity: number;
    unitPrice: number;
    expiryDate: string;
    manufacturerId: number;
    countryId: number;
    isFree: boolean;
}
