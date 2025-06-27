const vaccinationReceptionEndpointPrefix = "/vaccination-reception";

const vaccinationReceptionEndpoints = {
    generatePatientIdentifier: `${vaccinationReceptionEndpointPrefix}/patients/generate-identifier`,
    patientReception: `${vaccinationReceptionEndpointPrefix}/patient-reception`,
    addServiceReception: `${vaccinationReceptionEndpointPrefix}/request-forms/add-service`,
    getAllServiceTypes: `${vaccinationReceptionEndpointPrefix}/service-types`,
    getUnpaidServices: (receptionId?: number) => {
        return `${vaccinationReceptionEndpointPrefix}/receptions/${receptionId}/unpaid-services`;
    },
    deleteServiceReception: (receptionId: number) => {
        return `${vaccinationReceptionEndpointPrefix}/request-forms/${receptionId}/services`;
    },
};

export const receptionEndpoints = { vaccinationReceptionEndpoints };
