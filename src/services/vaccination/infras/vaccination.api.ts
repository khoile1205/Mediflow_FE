import { endpoints } from "~/constants/endpoints";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import {
    InjectVaccineRequest,
    GetMedicineListForVaccinationByReceptionIdResponse,
    GetNearestExpiryMedicineBatchResponse,
    UpdateVaccinationStatusRequest,
    WaitingPatientVaccination,
    VaccinationHistoryResponse,
    RejectVaccinationRequest,
    PendingVaccinationTodayResponse,
    ClosingReceptionRequest,
} from "./types";

const getWaitingPatientVaccinationList = async ({ searchTerm = "" }: ISearchParam) => {
    return await callApi<WaitingPatientVaccination[]>({
        url: endpoints.vaccination.getWaitingPatientVaccinationList,
        method: HttpMethod.GET,
        params: { searchTerm },
    });
};

const getMedicineVaccinationByReceptionId = async (receptionId?: number) => {
    return await callApi<GetMedicineListForVaccinationByReceptionIdResponse>({
        url: endpoints.vaccination.getMedicineVaccinationByReceptionId(receptionId),
        method: HttpMethod.GET,
        params: { receptionId },
    });
};

const getNearestExpiryMedicineBatch = async (medicineId: number) => {
    return await callApi<GetNearestExpiryMedicineBatchResponse>({
        url: endpoints.vaccination.getNearestExpiryMedicineBatch(medicineId),
        method: HttpMethod.GET,
        params: { medicineId },
    });
};

const updateVaccinationStatus = async (receptionId: number, data: UpdateVaccinationStatusRequest) => {
    return await callApi({
        url: endpoints.vaccination.updateVaccinationStatus(receptionId),
        method: HttpMethod.PUT,
        data,
    });
};

const injectVaccine = async (data: InjectVaccineRequest) => {
    return await callApi({
        url: endpoints.vaccination.injectVaccine,
        method: HttpMethod.POST,
        data,
    });
};

const confirmVaccinationToday = async (receptionId: number) => {
    return await callApi({
        url: endpoints.vaccination.confirmVaccinationToday(receptionId),
        method: HttpMethod.PUT,
        data: null,
    });
};

const getVaccinationHistory = async (patientId: number) => {
    return await callApi<VaccinationHistoryResponse>({
        url: endpoints.vaccination.getVaccinationHistory(patientId),
        method: HttpMethod.GET,
    });
};

const rejectInject = async (receptionVaccinationId: number, data: RejectVaccinationRequest) => {
    return await callApi({
        url: endpoints.vaccination.rejectInject(receptionVaccinationId),
        method: HttpMethod.PUT,
        data,
    });
};

const getPendingVaccinationsToday = async (receptionId: number) => {
    return await callApi<PendingVaccinationTodayResponse>({
        url: endpoints.vaccination.getPendingVaccinationsToday(receptionId),
        method: HttpMethod.GET,
    });
};

const closingReception = async (receptionId: number, data: ClosingReceptionRequest) => {
    return await callApi({
        url: endpoints.vaccination.closingReception(receptionId),
        method: HttpMethod.PUT,
        data,
    });
};

export const vaccinationApis = {
    getWaitingPatientVaccinationList,
    getMedicineVaccinationByReceptionId,
    getNearestExpiryMedicineBatch,
    updateVaccinationStatus,
    injectVaccine,
    confirmVaccinationToday,
    getVaccinationHistory,
    rejectInject,
    getPendingVaccinationsToday,
    closingReception,
};
