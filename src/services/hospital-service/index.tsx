import { endpoints } from "~/constants/endpoints";
import { ServiceGroup } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { ServiceGroupRequestParam } from "./types";

const getAllHospitalServiceGroup = async ({ searchTerms = "" }: ServiceGroupRequestParam) => {
    return await callApi<ServiceGroup[]>({
        url: `${endpoints.hospitalService.serviceGroupEndpoints.getAll}`,
        method: HttpMethod.GET,
        params: { searchTerms },
    });
};

const getAllHospitalDiseaseGroup = async () => {
    return await callApi<ServiceGroup[]>({
        url: `${endpoints.hospitalService.diseaseGroupEndpoints.getAll}`,
        method: HttpMethod.GET,
    });
};

export const hospitalServiceService = {
    getAllHospitalServiceGroup,
    getAllHospitalDiseaseGroup,
};
