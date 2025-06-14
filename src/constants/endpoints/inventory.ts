const inventoryEndpointPrefix = "/inventory";

const medicineEndpointPrefix = `${inventoryEndpointPrefix}/medicines`;
const medicineEndpoints = {
    standard: `${medicineEndpointPrefix}/`,
    getMedicineById: (id: string) => `${medicineEndpointPrefix}/${id}`,
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
};
