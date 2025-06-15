export type ImportMedicineFromSupplierDetail = {
    index?: number;
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
    medicineName?: string;
    unit?: string;
    totalPrice?: number;
    manufacturerName?: string;
    countryName?: string;
};

export type ImportMedicineFromSupplierFormValues = {
    documentCode: string;
    documentNumber: string;
    warehouseId: number;
    importDate: Date | string;
    supplierId?: number;
    supplierName?: string;
    note: string;
    receivedById?: number;
    receivedByName?: string;
    supportingDocument: string;
    endDate: Date | string;
    details: ImportMedicineFromSupplierDetail[];
};
