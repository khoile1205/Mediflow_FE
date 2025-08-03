import { MedicineBatchExpiredFormStatus } from "~/constants/enums";
import { IPaginationRequest } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";

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

export interface InventoryLimitStock {
    id: number;
    medicineId: number;
    medicineCode: string;
    medicineName: string;
    unit: string;
    currentStock: number;
    minimalStockThreshold: number;
    difference: number;
    inventoryLimitStockStatus: number;
    statusDescription: string;
    isSuspended?: boolean;
    isCancelled?: boolean;
}

export interface GetInventoryLimitStockListRequest {
    pageIndex: number;
    pageSize: number;
    searchKeyword?: string;
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
    routeOfAdministration: "IM" | "SC" | "ID" | null;
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
    pageIndex: number;
    pageSize: number;
    name?: string;
    code?: string;
    searchKeyword?: string;
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

export interface MedicinePrice {
    id: number;
    medicineId: number;
    medicineName?: string;
    unitPrice: number;
    currency: string;
    vatRate: number;
    vatAmount: number;
    originalPriceAfterVat: number;
    originalPriceBeforeVat: number;
    isSuspended: boolean;
    isCancelled: boolean;
    createdAt: string;
    createdBy: number;
    lastUpdatedAt: string;
    lastUpdatedBy: number;
}

export interface UpdateMedicinePriceRequest {
    id: number;
    medicineId: number;
    unitPrice: number;
    currency: string;
    vatRate: number;
    vatAmount: number;
    originalPriceBeforeVat: number;
    originalPriceAfterVat: number;
    isSuspended?: boolean;
}

export interface GetMedicinePriceListRequest extends IPaginationRequest {
    medicineId?: number;
}

export interface CreateMedicinePriceRequest {
    medicineId: number;
    unitPrice: number;
    currency: string;
    vatRate: number;
    vatAmount: number;
    originalPriceBeforeVat: number;
    originalPriceAfterVat: number;
    isSuspended: boolean;
    isCancelled: boolean;
}

export interface CreateExpiredReturnRequest {
    returnCode: string;
    reason: string;
    receiverSupplier: string;
    receiverName: string;
    receiverEmail: string;
    receiverPhone: string;
    details: ExpiredMedicineBatch[];
}

export interface ExpiredMedicineBatch {
    medicineBatchId: number;
    batchNumber: string;
    expirationDate: string;
    quantity: number;
}

export interface IGetListMedicineBatchesReturnFormRequest extends IPaginationRequest, ISearchParam {
    status: MedicineBatchExpiredFormStatus;
}
