const preExaminationEndpointPrefix = "/vaccination-reception/pre-examination";

export const preExaminationEndpoints = {
    getPreExaminationMedicines: (receptionId: number) => {
        return `${preExaminationEndpointPrefix}/reception/${receptionId}/medicines`;
    },

    addVaccineToPreExamination: (receptionId: number) => {
        return `${preExaminationEndpointPrefix}/${receptionId}`;
    },

    updatePreExaminationResult: (receptionId: number) => {
        return `${preExaminationEndpointPrefix}/${receptionId}/result`;
    },
};
