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
    routeOfAdministration: string;
    nationalMedicineCode: string;
    description: string;
    note: string;
    unitPrice: number;
    registrationNumber: string;
    medicineTypeId: number;
    vaccineTypeId: number;
    isSuspended: boolean;
    isCancelled: boolean;
    createdAt: Date;
    createdBy: number;
    lastUpdatedAt: Date;
    lastUpdatedBy: number;
    vaccineTypeName: string;
}

export interface MedicinePrice {
    id: number;
    medicineId: number;
    unitPrice: number;
    currency: string;
    vatRate: number;
    vatAmount: number;
    originalPriceAfterVat: number;
    originalPriceBeforeVat: number;
    isSuspended: boolean;
    isCancelled: boolean;
    createdAt: Date;
    createdBy: number;
    lastUpdatedAt: Date;
    lastUpdatedBy: number;
}

export class Manufacture {
    id: number;
    manufacturerName: string;
}

export class ManufactureCountry {
    id: number;
    countryName: string;
}
