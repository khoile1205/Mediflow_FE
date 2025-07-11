const vaccinationReceptionEndpointPrefix = "/vaccination-reception";

const vaccinationReceptionEndpoints = {
    generatePatientIdentifier: `${vaccinationReceptionEndpointPrefix}/patients/generate-identifier`,
    patientReception: `${vaccinationReceptionEndpointPrefix}/patient-reception`,
    addServiceReception: `${vaccinationReceptionEndpointPrefix}/request-forms/add-service`,
    getAllServiceTypes: `${vaccinationReceptionEndpointPrefix}/service-types`,
    getUnpaidServices: (receptionId?: number) => {
        return `${vaccinationReceptionEndpointPrefix}/receptions/${receptionId}/unpaid-services`;
    },
    createPrevaccinationReport: `${vaccinationReceptionEndpointPrefix}/screening-evaluations`,
    updateVaccinationPrescreening: (vaccinationPrescreeningId: number) => {
        return `${vaccinationReceptionEndpointPrefix}/screening-evaluation/${vaccinationPrescreeningId}`;
    },
    getServiceReceptionByReceptionId: (receptionId: number) => {
        return `${vaccinationReceptionEndpointPrefix}/receptions/${receptionId}/services`;
    },
    deleteServiceReceptionByReceptionId: (receptionId: number) => {
        return `${vaccinationReceptionEndpointPrefix}/request-forms/${receptionId}/services`;
    },

    // TODO: update endpoint
    getVaccinationReceptionByReceptionId: (receptionId: number) => {
        return `${vaccinationReceptionEndpointPrefix}/receptions/${receptionId}/vaccinations`;
    },
    addVaccinationReception: `${vaccinationReceptionEndpointPrefix}/reception-vaccinations`,
    deleteVaccinationReceptionById: (receptionId: number) => {
        return `${vaccinationReceptionEndpointPrefix}/reception-vaccinations/${receptionId}`;
    },
    updateVaccinationReceptionByReceptionId: (receptionId: number) =>
        `${vaccinationReceptionEndpointPrefix}/receptions/${receptionId}/reception-vaccinations`,

    getLatestReceptionIdByPatientId: (patientId?: number) => {
        return `${vaccinationReceptionEndpointPrefix}/patients/${patientId}/latest-reception-id`;
    },
};

export const receptionEndpoints = { vaccinationReceptionEndpoints };
