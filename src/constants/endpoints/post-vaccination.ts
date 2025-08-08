const postVaccinationEndpointPrefix = "/vaccination-reception/vaccination/post-vaccination";

export const postVaccinationEndpoints = {
    getPostVaccinationPatients: `${postVaccinationEndpointPrefix}`,

    getPostVaccinationMedicines: (receptionId: number) => {
        return `${postVaccinationEndpointPrefix}/reception/${receptionId}/medicines`;
    },

    updatePostVaccinationResult: (receptionId: number) => {
        return `/vaccination-reception/vaccination/${receptionId}/post-vaccination`;
    },
};
