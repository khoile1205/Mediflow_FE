const examinationEndpointPrefix = "/vaccination-reception/examination";

export const examinationEndpoints = {
    getAllExaminationHistory: `${examinationEndpointPrefix}/history`,
    getExaminationHistoryDetailById: (examinationId: number) =>
        `${examinationEndpointPrefix}/${examinationId}/examination-result`,
    getPatientExaminationHistory: (patientId: number) => `${examinationEndpointPrefix}/history/patient/${patientId}`,
    getPatientsForExamination: `${examinationEndpointPrefix}/patients`,
    getAllExaminationOfReceptionByReceptionId: (id: number) => `/vaccination-reception/reception/${id}/examination`,
    getServiceTestParametersOfExaminationByExaminationId: (id: number) =>
        `/vaccination-reception/examinations/${id}/service-test-parameters`,
    getPatientExaminationDetailByExaminationId: (id: number) => `${examinationEndpointPrefix}/${id}/patient-detail`,
    upsertExaminationResult: `${examinationEndpointPrefix}/results`,
    getAllExaminationTechnician: `${examinationEndpointPrefix}/users?roleName=LaboratoryStaff`,
};
