const examinationPrefix = "/vaccination-reception/examination";

export const examinationEndpoints = {
    getPatientsForExamination: `${examinationPrefix}/patients`,
    getAllExaminationOfReceptionByReceptionId: (id: number) => `/vaccination-reception/reception/${id}/examination`,
    getServiceTestParametersOfExaminationByExaminationId: (id: number) =>
        `/vaccination-reception/examinations/${id}/service-test-parameters`,
    getPatientExaminationDetailByExaminationId: (id: number) => `${examinationPrefix}/${id}/patient-detail`,
    upsertExaminationResult: `${examinationPrefix}/results`,
    getAllExaminationTechnician: `${examinationPrefix}/users?roleName=LaboratoryStaff`,
};
