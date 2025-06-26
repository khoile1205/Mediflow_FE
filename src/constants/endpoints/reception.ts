const vaccinationReceptionEndpointPrefix = "/vaccination-reception";

const vaccinationReceptionEndpoints = {
    generatePatientIdentifier: `${vaccinationReceptionEndpointPrefix}/patients/generate-identifier`,
    patientReception: `${vaccinationReceptionEndpointPrefix}/patient-reception`,
    addServiceReception: `${vaccinationReceptionEndpointPrefix}/request-form/add-service`,
};

export const receptionEndpoints = { vaccinationReceptionEndpoints };
