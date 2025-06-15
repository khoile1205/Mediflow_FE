export interface Medicine {
    id: number;
    medicineCode: string;
    medicineName: string;
    unit: string;
    manufacturer: Manufacture | null;
    activeIngredient: string;
    usageInstructions: string;
    concentration: string;
    indications: string;
    medicineClassification: string;
    routeOfAdministration: string;
    nationalMedicineCode: string;
    description: string;
    note: string;
    registrationNumber: string;
    medicineTypeId: number;
    vaccineTypeId: number;
    isSuspended: boolean;
    isCancelled: boolean;
    createdAt: Date;
    createdBy: number;
    lastUpdatedAt: Date;
    lastUpdatedBy: number;
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
