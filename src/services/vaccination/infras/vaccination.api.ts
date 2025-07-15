import { endpoints } from "~/constants/endpoints";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import {
    GetMedicineListForVaccinationByReceptionIdResponse,
    GetNearestExpiryMedicineBatchResponse,
    WaitingPatientVaccination,
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

export const vaccinationApis = {
    getWaitingPatientVaccinationList,
    getMedicineVaccinationByReceptionId,
    getNearestExpiryMedicineBatch,
};
