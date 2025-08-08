const patientEndpointPrefix = "/patients";
const patientEndpoints = {
    generateIdentifierCode: `${patientEndpointPrefix}/generate-identifier`,
    getListPatientWithPagination: `/vaccination-reception${patientEndpointPrefix}`,
    getPatientById: (id: number) => `/vaccination-reception${patientEndpointPrefix}/${id}`,
};

export { patientEndpoints };
