import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { PostVaccinationPatient, PostVaccinationMedicine, UpdatePostVaccinationRequest } from "./types";
import { postVaccinationEndpoints } from "~/constants/endpoints/post-vaccination";

const getPostVaccinationPatients = async (patientName: string) => {
    return await callApi<PostVaccinationPatient[]>({
        url: postVaccinationEndpoints.getPostVaccinationPatients,
        method: HttpMethod.GET,
        params: { patientName },
    });
};

const getPostVaccinationMedicines = async (receptionId: number) => {
    return await callApi<PostVaccinationMedicine[]>({
        url: postVaccinationEndpoints.getPostVaccinationMedicines(receptionId),
        method: HttpMethod.GET,
    });
};

const updatePostVaccinationResult = async (receptionId: number, data: UpdatePostVaccinationRequest) => {
    return await callApi<void>({
        url: postVaccinationEndpoints.updatePostVaccinationResult(receptionId),
        method: HttpMethod.PUT,
        data,
    });
};

export const postVaccinationApis = {
    getPostVaccinationPatients,
    getPostVaccinationMedicines,
    updatePostVaccinationResult,
};
