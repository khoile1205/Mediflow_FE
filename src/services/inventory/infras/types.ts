import { IPaginationRequest } from "~/libs/axios/types";

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

export interface Medicine {
    id: number;
    medicineCode: string;
    medicineName: string;
    unit: string;
    activeIngredient: string;
    usageInstructions: string;
    concentration: string;
    indications: string;
    medicineClassification: string;
    routeOfAdministration: "IM" | "SC" | "ID" | "PO" | "IN" | null;
    nationalMedicineCode: string;
    description: string;
    note: string;
    registrationNumber: string;
    unitPrice: number;
    isSuspended: boolean;
    isCancelled: boolean;
    createdAt: string;
    createdBy: number;
    lastUpdatedAt: string;
    lastUpdatedBy: number;
}

export interface GetMedicineListRequest extends IPaginationRequest {
    name?: string;
    code?: string;
}

export interface CreateMedicineRequest {
    medicineCode: string;
    medicineName: string;
    unit: string;
    activeIngredient: string;
    usageInstructions: string;
    concentration: string;
    indications: string;
    medicineClassification: string;
    routeOfAdministration: number;
    nationalMedicineCode: string;
    description: string;
    note: string;
    registrationNumber: string;
    isRequiredTestingBeforeUse: boolean;
    medicineTypeId: number;
    vaccineTypeId: number;
}

export interface UpdateMedicineDto {
    id: number;
    medicineCode: string;
    medicineName: string;
    unit: string;
    activeIngredient: string;
    usageInstructions: string;
    concentration: string;
    indications: string;
    medicineClassification: string;
    routeOfAdministration: number;
    nationalMedicineCode: string;
    description: string;
    note: string;
    registrationNumber: string;
    vaccineTypeId: number;
    isRequiredTestingBeforeUse: boolean;
    isSuspended: boolean;
    isCancelled: boolean;
    manufacturer?: string;
}

export interface VaccineType {
    vaccineTypeId: number;
    vaccinatTypeName: string;
}

export interface MedicineInteraction {
    id: number;
    medicineId1: number;
    medicineId2: number;
    medicineName1: string;
    medicineName2: string;
    harmfulEffects: string;
    mechanism: string;
    preventiveActions: string;
    referenceInfo: string;
    notes: string;
    isSuspended?: boolean;
    isCancelled?: boolean;
    createdAt?: string;
    createdBy?: number;
    lastUpdatedAt?: string;
    lastUpdatedBy?: number;
}

export type UpdateMedicineInteractionRequest = Omit<
    MedicineInteraction,
    "createdAt" | "createdBy" | "lastUpdatedAt" | "lastUpdatedBy" | "medicineName1" | "medicineName2"
>;

export interface GetMedicineInteractionListRequest {
    pageIndex: number;
    pageSize: number;
    medicineId1?: number;
    medicineId2?: number;
    harmfulEffects?: string;
}

export interface CreateMedicineInteractionRequest {
    medicineId1: number;
    medicineId2: number;
    harmfulEffects: string;
    mechanism: string;
    preventiveActions: string;
    referenceInfo: string;
    notes: string;
}
