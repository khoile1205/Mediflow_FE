const inventoryEndpointPrefix = "/inventory";

const medicineEndpointPrefix = `${inventoryEndpointPrefix}/medicines`;
const medicineEndpoints = {
    standard: `${medicineEndpointPrefix}/`,
    getMedicineById: (id: string) => `${medicineEndpointPrefix}/${id}`,
    getList: `${medicineEndpointPrefix}`,
    createMedicine: `${medicineEndpointPrefix}`,
    updateMedicine: (id: number | string) => `${medicineEndpointPrefix}/${id}`,
    deleteMedicine: (id: number | string) => `${medicineEndpointPrefix}/${id}`,
};

const vaccineTypeEndpointPrefix = `${inventoryEndpointPrefix}/vaccine-types`;

export const vaccineTypeEndpoints = {
    standard: `${vaccineTypeEndpointPrefix}`,
};

const medicineInteractionEndpointPrefix = `${inventoryEndpointPrefix}/medicine-interactions`;

const medicineInteractionEndpoints = {
    standard: `${inventoryEndpointPrefix}/medicine-interactions`,
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

export const inventoryEndpoints = {
    medicine: medicineEndpoints,
    manufacturer: manufacturerEndpoints,
    manufacturerCountry: manufacturerCountryEndpoints,
    supplierImportDocument: documentImportFromSupplierEndpoints,
    supplier: supplierEndpoints,
    vaccineType: vaccineTypeEndpoints,
    medicineInteraction: medicineInteractionEndpoints,
};
