const vaccinationEndpointPrefix = "/vaccination-reception/vaccination";

export const vaccinationEndpoints = {
    getWaitingPatientVaccinationList: `${vaccinationEndpointPrefix}/waiting-patients`,
    getMedicineVaccinationByReceptionId: (receptionId: number) =>
        `${vaccinationEndpointPrefix}/reception/${receptionId}/medicines`,
    getNearestExpiryMedicineBatch: (medicineId: number) =>
        `${vaccinationEndpointPrefix}/nearest-expiry-medicine-batch/${medicineId}`,
    updateVaccinationStatus: (receptionId: number) => `${vaccinationEndpointPrefix}/${receptionId}/status`,
    injectVaccine: `${vaccinationEndpointPrefix}`,
    confirmVaccinationToday: (receptionId: number) =>
        `${vaccinationEndpointPrefix}/receptions/${receptionId}/confirm-vaccination-today`,
    getAllVaccinationHistory: `${vaccinationEndpointPrefix}/history`,
    getVaccinationHistory: (patientId: number) => `${vaccinationEndpointPrefix}/patient/${patientId}/history`,
    rejectInject: (receptionVaccinationId: number) => `/vaccination-reception/${receptionVaccinationId}/reject`,
    getPendingVaccinationsToday: (receptionId: number) =>
        `${vaccinationEndpointPrefix}/reception/${receptionId}/pending-vaccinations-today`,
    closingReception: (receptionId: number) => `/vaccination-reception/closing-reception/reception/${receptionId}`,
};
