const hospitalServiceEndpointPrefix = "hospital-service";

const serviceGroupEndpointPrefix = `${hospitalServiceEndpointPrefix}/service-groups`;
const serviceGroupEndpoints = {
    getListWithPagination: `${serviceGroupEndpointPrefix}/`,
    getAll: `${serviceGroupEndpointPrefix}/all`,
    create: `${serviceGroupEndpointPrefix}`,
    update: (id: number) => `${serviceGroupEndpointPrefix}/${id}`,
    delete: (id: number) => `${serviceGroupEndpointPrefix}/${id}`,
    assignServicesToGroup: `${serviceGroupEndpointPrefix}/assign-services`,
    removeServicesFromGroup: (groupId: number) => `${serviceGroupEndpointPrefix}/${groupId}/services`,
};

const diseaseGroupEndpointPrefix = `${hospitalServiceEndpointPrefix}/disease-groups`;
const diseaseGroupEndpoints = {
    getListWithPagination: `${diseaseGroupEndpointPrefix}/`,
    getAll: `${diseaseGroupEndpointPrefix}/all`,
};

const serviceEndpointPrefix = `${hospitalServiceEndpointPrefix}/services`;
const serviceEndpoints = {
    getAll: `${serviceEndpointPrefix}/all`,
    getAllWithDetails: `${serviceEndpointPrefix}/details`,
    create: `${serviceEndpointPrefix}`,
    update: (id: number) => `${serviceEndpointPrefix}/${id}`,
    delete: (id: number) => `${serviceEndpointPrefix}/${id}`,
    getDetails: (id: number) => `${serviceEndpointPrefix}/${id}`,
    getByIds: `${serviceEndpointPrefix}/by-ids`,
    getServicesByGroupId: `${serviceEndpointPrefix}/group`,
};

const examinationServiceEndpointPrefix = `${serviceEndpointPrefix}/examination`;
const examinationServiceEndpoints = {
    getAll: `${examinationServiceEndpointPrefix}`,
    create: `${examinationServiceEndpointPrefix}`,
    update: (id: number) => `${examinationServiceEndpointPrefix}/${id}`,
    delete: (id: number) => `${examinationServiceEndpointPrefix}/${id}`,
};

const vaccinationReceptionEndpointPrefix = "vaccination-reception";
const examinationReceptionEndpointPrefix = `${vaccinationReceptionEndpointPrefix}/examinations`;

const examinationReceptionEndpoints = {
    getServiceTestParametersByExaminationId: (examinationId: number) =>
        `${examinationReceptionEndpointPrefix}/${examinationId}/service-test-parameters`,
};

export const hospitalServiceEndpoints = {
    serviceGroupEndpoints,
    diseaseGroupEndpoints,
    serviceEndpoints,
    examinationServiceEndpoints,
    examinationReceptionEndpoints,
};
