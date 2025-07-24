import { endpoints } from "~/constants/endpoints";
import {
    Examination,
    ExaminationOfReception,
    ExaminationTechnician,
    PatientForExamination,
    ServiceTestParameter,
} from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import { ExaminationHistoryDetail, PatientExaminationHistory, PatientExaminationSummary } from "./types";

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

const getAllExaminationHistory = async (params: IPaginationRequest & ISearchParam) => {
    return callApi<IPagination<PatientExaminationSummary>>({
        url: endpoints.examination.getAllExaminationHistory,
        method: HttpMethod.GET,
        params,
    });
};

const getPatientExaminationHistory = async (patientId: number) => {
    return callApi<PatientExaminationHistory>({
        url: endpoints.examination.getPatientExaminationHistory(patientId),
        method: HttpMethod.GET,
    });
};

const getExaminationHistoryDetailById = async (examinationId: number) => {
    return callApi<ExaminationHistoryDetail>({
        url: endpoints.examination.getExaminationHistoryDetailById(examinationId),
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
    getAllExaminationHistory,
    getPatientExaminationHistory,
    getExaminationHistoryDetailById,
};
