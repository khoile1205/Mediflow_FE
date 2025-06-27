const patientEndpointPrefix = "/patients";
const patientEndpoints = {
    generateIdentifierCode: `${patientEndpointPrefix}/generate-identifier`,
    getListPatientWithPagination: `/vaccination-reception${patientEndpointPrefix}`,
};

export { patientEndpoints };
