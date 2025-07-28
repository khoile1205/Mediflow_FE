const examinationEndpointPrefix = "/vaccination-reception/examination";

export const examinationEndpoints = {
    getAllExaminationHistory: `${examinationEndpointPrefix}/history`,
    getExaminationHistoryDetailById: (examinationId: number) =>
        `${examinationEndpointPrefix}/${examinationId}/examination-result`,
    getPatientExaminationHistory: (patientId: number) => `${examinationEndpointPrefix}/history/patient/${patientId}`,
    getPatientsForExamination: `${examinationEndpointPrefix}/patients`,
    getAllExaminationOfReceptionByReceptionId: (id: number) =>
        `${examinationEndpointPrefix}/reception/${id}/examination`,
    getServiceTestParametersOfExaminationByExaminationId: (id: number) =>
        `${examinationEndpointPrefix}/examinations/${id}/service-test-parameters`,
    getPatientExaminationDetailByExaminationId: (id: number) => `${examinationEndpointPrefix}/${id}/patient-detail`,
    upsertExaminationResult: `${examinationEndpointPrefix}/results`,
    getAllExaminationTechnician: `${examinationEndpointPrefix}/users?roleName=LaboratoryStaff`,
};
