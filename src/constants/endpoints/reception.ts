const vaccinationReceptionEndpointPrefix = "/vaccination-reception";

const vaccinationReceptionEndpoints = {
    patientReception: `${vaccinationReceptionEndpointPrefix}/patient-reception`,
    addServiceReception: `${vaccinationReceptionEndpointPrefix}/request-form/add-service`,
};

export const receptionEndpoints = { vaccinationReceptionEndpoints };
