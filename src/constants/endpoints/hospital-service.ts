const serviceGroupEndpointPrefix = "service-group";
const serviceGroupEndpoints = {
    standard: `${serviceGroupEndpointPrefix}/`,
    getAll: `${serviceGroupEndpointPrefix}/all`,
};

const diseaseGroupEndpointPrefix = "disease-groups";
const diseaseGroupEndpoints = {
    standard: `${diseaseGroupEndpointPrefix}/`,
    getAll: `${diseaseGroupEndpointPrefix}/all`,
};

export const hospitalServiceEndpoints = { serviceGroupEndpoints, diseaseGroupEndpoints };
