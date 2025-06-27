const hospitalServiceEndpointPrefix = "hospital-service";

const serviceGroupEndpointPrefix = `${hospitalServiceEndpointPrefix}/service-groups`;
const serviceGroupEndpoints = {
    getServiceGroupsWithPagination: `${serviceGroupEndpointPrefix}/`,
    getAll: `${serviceGroupEndpointPrefix}/all`,
};

const diseaseGroupEndpointPrefix = `${hospitalServiceEndpointPrefix}/disease-groups`;
const diseaseGroupEndpoints = {
    getDiseaseGroupWithPagination: `${diseaseGroupEndpointPrefix}/`,
    getAll: `${diseaseGroupEndpointPrefix}/all`,
};

const serviceEndpointPrefix = `${hospitalServiceEndpointPrefix}/services`;
const serviceEndpoints = {
    getAll: `${serviceEndpointPrefix}/all`,
};

export const hospitalServiceEndpoints = { serviceGroupEndpoints, diseaseGroupEndpoints, serviceEndpoints };
