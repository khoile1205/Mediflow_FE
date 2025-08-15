const inventoryEndpointPrefix = "/inventory";

const medicineEndpointPrefix = `${inventoryEndpointPrefix}/medicines`;
const medicineEndpoints = {
    standard: `${medicineEndpointPrefix}/`,
    getList: `${medicineEndpointPrefix}`,
    getMedicineById: (id: string) => `${medicineEndpointPrefix}/${id}`,
    createMedicine: `${medicineEndpointPrefix}`,
    updateMedicine: (id: number | string) => `${medicineEndpointPrefix}/${id}`,
    deleteMedicine: (id: number | string) => `${medicineEndpointPrefix}/${id}`,
    getExpiredMedicineBatches: `${medicineEndpointPrefix}/expired-batches`,
};

const medicinePriceEndpointPrefix = `${inventoryEndpointPrefix}/medicine-prices`;
const medicinePriceEndpoints = {
    standard: `${medicinePriceEndpointPrefix}`,
    getList: `${medicinePriceEndpointPrefix}`,
    create: `${medicinePriceEndpointPrefix}`,
    update: (id: number | string) => `${medicinePriceEndpointPrefix}/${id}`,
    delete: (id: number | string) => `${medicinePriceEndpointPrefix}/${id}`,
};

const vaccineTypeEndpointPrefix = `${inventoryEndpointPrefix}/vaccine-types`;
const vaccineTypeEndpoints = {
    standard: `${vaccineTypeEndpointPrefix}`,
};

const medicineInteractionEndpointPrefix = `${inventoryEndpointPrefix}/medicine-interactions`;
const medicineInteractionEndpoints = {
    standard: `${medicineInteractionEndpointPrefix}`,
    create: `${medicineInteractionEndpointPrefix}`,
    update: (id: number | string) => `${medicineInteractionEndpointPrefix}/${id}`,
    delete: (id: number | string) => `${medicineInteractionEndpointPrefix}/${id}`,
};

const manufacturerEndpointPrefix = `${inventoryEndpointPrefix}/manufacturers`;
const manufacturerEndpoints = {
    standard: `${manufacturerEndpointPrefix}/`,
};

const manufacturerCountryEndpointPrefix = `${inventoryEndpointPrefix}/countries`;
const manufacturerCountryEndpoints = {
    standard: `${manufacturerCountryEndpointPrefix}/`,
};

const supplierEndpointPrefix = `${inventoryEndpointPrefix}/suppliers`;
const supplierEndpoints = {
    standard: `${supplierEndpointPrefix}/`,
};

const documentImportFromSupplierEndpoints = {
    createDocument: `${inventoryEndpointPrefix}/import-medicine-from-supplier/`,
    generateDocumentCode: `${inventoryEndpointPrefix}/supplier-import-documents/generate-code`,
};

const inventoryLimitStockEndpointPrefix = `${inventoryEndpointPrefix}/inventory-limit-stocks`;

const inventoryLimitStockEndpoints = {
    standard: inventoryLimitStockEndpointPrefix,
    getList: inventoryLimitStockEndpointPrefix,
    create: inventoryLimitStockEndpointPrefix,
    update: (id: number | string) => `${inventoryLimitStockEndpointPrefix}/${id}`,
    delete: (id: number | string) => `${inventoryLimitStockEndpointPrefix}/${id}`,
};

const expiredReturnEndpointPrefix = `${inventoryEndpointPrefix}/medicine-batch-returns`;
const expiredReturnEndpoints = {
    generateReturnCode: `/inventory/unique-code/generate`,
    approveExpiredForm: (id: number) => `/inventory/medicine-batch-returns/${id}/approve`,
    rejectExpiredForm: (id: number) => `/inventory/medicine-batch-returns/${id}/reject`,
    createExpiredReturn: `${expiredReturnEndpointPrefix}/`,
    getAllExpiredMedicineBatchForms: `${expiredReturnEndpointPrefix}/`,
    getExpiredMedicineBatchFormById: (id: number) => `${expiredReturnEndpointPrefix}/${id}`,
};

const medicineQuantityStatisticsEndpoints = {
    getList: `${inventoryEndpointPrefix}/medicine-quantity-statistics`,
    getBatchesByMedicineId: (medicineId: number | string) =>
        `${inventoryEndpointPrefix}/medicine-quantity-statistics/medicines/${medicineId}/medicine-batches`,
};

export const inventoryEndpoints = {
    medicine: medicineEndpoints,
    medicinePrice: medicinePriceEndpoints,
    manufacturer: manufacturerEndpoints,
    manufacturerCountry: manufacturerCountryEndpoints,
    supplierImportDocument: documentImportFromSupplierEndpoints,
    supplier: supplierEndpoints,
    inventoryLimitStock: inventoryLimitStockEndpoints,
    vaccineType: vaccineTypeEndpoints,
    medicineInteraction: medicineInteractionEndpoints,
    expiredReturn: expiredReturnEndpoints,
    medicineQuantityStatistics: medicineQuantityStatisticsEndpoints,
};
