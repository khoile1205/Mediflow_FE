import { endpoints } from "~/constants/endpoints";
import {
    Examination,
    ExaminationOfReception,
    ExaminationTechnician,
    PatientForExamination,
    ServiceTestParameter,
} from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";

const getPatientsForExamination = async (patientName?: string, isDiagnose?: boolean) => {
    return await callApi<PatientForExamination[]>({
        url: endpoints.examination.getPatientsForExamination,
        method: HttpMethod.GET,
        params: {
            patientName,
            isDiagnose,
        },
    });
};

const getAllExaminationOfReceptionByReceptionId = async (id: number) => {
    return await callApi<ExaminationOfReception[]>({
        url: endpoints.examination.getAllExaminationOfReceptionByReceptionId(id),
        method: HttpMethod.GET,
    });
};

const getServiceTestParametersOfExaminationByExaminationId = async (id: number) => {
    return await callApi<ServiceTestParameter[]>({
        url: endpoints.examination.getServiceTestParametersOfExaminationByExaminationId(id),
        method: HttpMethod.GET,
    });
};

const getPatientExaminationDetailByExaminationId = async (id: number) => {
    return await callApi<Examination>({
        url: endpoints.examination.getPatientExaminationDetailByExaminationId(id),
        method: HttpMethod.GET,
    });
};

const upsertExaminationResult = async (payload: Examination[]) => {
    return await callApi({
        url: endpoints.examination.upsertExaminationResult,
        method: HttpMethod.POST,
        data: {
            results: payload,
        },
    });
};

const getAllExaminationTechnician = async () => {
    return await callApi<ExaminationTechnician[]>({
        url: endpoints.examination.getAllExaminationTechnician,
        method: HttpMethod.GET,
    });
};

export const examinationApis = {
    getPatientsForExamination,
    getAllExaminationOfReceptionByReceptionId,
    getServiceTestParametersOfExaminationByExaminationId,
    getPatientExaminationDetailByExaminationId,
    upsertExaminationResult,
    getAllExaminationTechnician,
};
