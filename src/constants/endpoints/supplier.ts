const supplierEndpointPrefix = `inventory/suppliers`;
export const supplierEndpoints = {
    getSupplierWithPagination: `${supplierEndpointPrefix}/`,
    getSupplierById: (id: number) => `${supplierEndpointPrefix}/${id}`,
    createSupplier: `${supplierEndpointPrefix}`,
    updateSupplier: (id: number) => `${supplierEndpointPrefix}/${id}`,
    deleteSupplier: (id: number) => `${supplierEndpointPrefix}/${id}`,
};
