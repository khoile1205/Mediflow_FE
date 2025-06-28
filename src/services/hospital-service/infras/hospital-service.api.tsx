import { endpoints } from "~/constants/endpoints";
import { DiseaseGroup, Service, ServiceGroup } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { ISearchParam } from "./types";

const getAllHospitalServiceGroup = async ({ searchTerms = "" }: ISearchParam) => {
    return await callApi<ServiceGroup[]>({
        url: `${endpoints.hospitalService.serviceGroupEndpoints.getAll}`,
        method: HttpMethod.GET,
        params: { searchTerms },
    });
};

const getAllHospitalDiseaseGroup = async ({ searchTerms = "" }: ISearchParam) => {
    return await callApi<DiseaseGroup[]>({
        url: `${endpoints.hospitalService.diseaseGroupEndpoints.getAll}`,
        method: HttpMethod.GET,
        params: { searchTerms },
    });
};

const getAllHospitalServices = async () => {
    return await callApi<Service[]>({
        url: `${endpoints.hospitalService.serviceEndpoints.getAll}`,
        method: HttpMethod.GET,
    });
};

export const hospitalServiceApis = {
    getAllHospitalServiceGroup,
    getAllHospitalDiseaseGroup,
    getAllHospitalServices,
};
