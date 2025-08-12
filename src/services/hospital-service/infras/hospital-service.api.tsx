import { endpoints } from "~/constants/endpoints";
import { DiseaseGroup, Service, ServiceGroup } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { ISearchParam } from "./types";
import { HospitalServiceType } from "~/constants/enums";

const getAllHospitalServiceGroup = async ({ searchTerm = "" }: ISearchParam) => {
    return await callApi<ServiceGroup[]>({
        url: `${endpoints.hospitalService.serviceGroupEndpoints.getAll}`,
        method: HttpMethod.GET,
        params: { searchTerm },
    });
};

const getAllHospitalDiseaseGroup = async ({ searchTerm = "" }: ISearchParam) => {
    return await callApi<DiseaseGroup[]>({
        url: `${endpoints.hospitalService.diseaseGroupEndpoints.getAll}`,
        method: HttpMethod.GET,
        params: { searchTerm },
    });
};

const getAllHospitalServices = async ({ serviceType }: { serviceType?: HospitalServiceType }) => {
    return await callApi<Service[]>({
        url: `${endpoints.hospitalService.serviceEndpoints.getAll}`,
        method: HttpMethod.GET,
        params: {
            serviceType,
        },
    });
};

export const hospitalServiceApis = {
    getAllHospitalServiceGroup,
    getAllHospitalDiseaseGroup,
    getAllHospitalServices,
};
