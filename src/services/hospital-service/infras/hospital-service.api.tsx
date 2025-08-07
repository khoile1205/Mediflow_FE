import { endpoints } from "~/constants/endpoints";
import { DiseaseGroup, Service, ServiceGroup } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IBaseApiResponse } from "~/libs/axios/types";
import {
    AssignServicesToGroupRequest,
    CreateHospitalServiceGroupRequest,
    CreateHospitalServiceRequest,
    HospitalServiceGroupListResponse,
    ISearchParam,
    UpdateHospitalServiceGroupRequest,
    UpdateHospitalServiceRequest,
} from "./types";
import { HospitalServiceGroup } from "~/pages/hospital-services/types";

const getHospitalServiceGroupListWithPagination = async (
    params: ISearchParam,
): Promise<HospitalServiceGroupListResponse> => {
    const res = await callApi<HospitalServiceGroupListResponse>({
        url: endpoints.hospitalService.serviceGroupEndpoints.getListWithPagination,
        method: HttpMethod.GET,
        params,
    });

    return res.Data;
};

const getAllHospitalServiceGroup = async ({ searchTerm = "" }: ISearchParam) => {
    return await callApi<ServiceGroup[]>({
        url: endpoints.hospitalService.serviceGroupEndpoints.getAll,
        method: HttpMethod.GET,
        params: { searchTerm },
    });
};

const createHospitalServiceGroup = async (
    data: CreateHospitalServiceGroupRequest,
): Promise<IBaseApiResponse<HospitalServiceGroup>> => {
    return await callApi({
        url: endpoints.hospitalService.serviceGroupEndpoints.create,
        method: HttpMethod.POST,
        data,
    });
};

const updateHospitalServiceGroup = async (
    data: UpdateHospitalServiceGroupRequest,
): Promise<IBaseApiResponse<HospitalServiceGroup>> => {
    return await callApi({
        url: endpoints.hospitalService.serviceGroupEndpoints.update(data.id),
        method: HttpMethod.PUT,
        data,
    });
};

const deleteHospitalServiceGroup = async (id: number) => {
    return await callApi({
        url: endpoints.hospitalService.serviceGroupEndpoints.delete(id),
        method: HttpMethod.DELETE,
    });
};

const assignServicesToGroup = async (data: AssignServicesToGroupRequest) => {
    return await callApi({
        url: endpoints.hospitalService.serviceGroupEndpoints.assignServicesToGroup,
        method: HttpMethod.POST,
        data,
    });
};

const removeServicesFromGroup = async (groupId: number, serviceIds: number[]) => {
    return await callApi({
        url: endpoints.hospitalService.serviceGroupEndpoints.removeServicesFromGroup(groupId),
        method: HttpMethod.DELETE,
        data: { serviceIds },
    } as any);
};

const getHospitalDiseaseGroupListWithPagination = async (params: ISearchParam) => {
    return await callApi<DiseaseGroup[]>({
        url: endpoints.hospitalService.diseaseGroupEndpoints.getListWithPagination,
        method: HttpMethod.GET,
        params,
    });
};

const getAllHospitalDiseaseGroup = async ({ searchTerm = "" }: ISearchParam) => {
    return await callApi<DiseaseGroup[]>({
        url: endpoints.hospitalService.diseaseGroupEndpoints.getAll,
        method: HttpMethod.GET,
        params: { searchTerm },
    });
};

const getAllHospitalServices = async () => {
    return await callApi<Service[]>({
        url: endpoints.hospitalService.serviceEndpoints.getAll,
        method: HttpMethod.GET,
    });
};

const getAllHospitalServicesWithDetails = async () => {
    return await callApi<Service[]>({
        url: endpoints.hospitalService.serviceEndpoints.getAllWithDetails,
        method: HttpMethod.GET,
    });
};

const getHospitalServiceDetails = async (id: number) => {
    return await callApi<Service>({
        url: endpoints.hospitalService.serviceEndpoints.getDetails(id),
        method: HttpMethod.GET,
    });
};

const createHospitalService = async (data: CreateHospitalServiceRequest) => {
    return await callApi({
        url: endpoints.hospitalService.serviceEndpoints.create,
        method: HttpMethod.POST,
        data,
    });
};

const updateHospitalService = async (data: UpdateHospitalServiceRequest) => {
    return await callApi({
        url: endpoints.hospitalService.serviceEndpoints.update(data.id),
        method: HttpMethod.PUT,
        data,
    });
};

const deleteHospitalService = async (id: number) => {
    return await callApi({
        url: endpoints.hospitalService.serviceEndpoints.delete(id),
        method: HttpMethod.DELETE,
    });
};

const getServicesByIds = async (serviceIds: number[]) => {
    return await callApi<Service[]>({
        url: endpoints.hospitalService.serviceEndpoints.getByIds,
        method: HttpMethod.POST,
        data: serviceIds,
    });
};

const getServicesByGroupId = async (groupId: number) => {
    return await callApi<Service[]>({
        url: endpoints.hospitalService.serviceEndpoints.getServicesByGroupId,
        method: HttpMethod.GET,
        params: {
            groupId,
            groupType: "servicegroup",
        },
    });
};

export const hospitalServiceApis = {
    getHospitalServiceGroupListWithPagination,
    getAllHospitalServiceGroup,
    createHospitalServiceGroup,
    updateHospitalServiceGroup,
    deleteHospitalServiceGroup,
    assignServicesToGroup,
    removeServicesFromGroup,
    getHospitalDiseaseGroupListWithPagination,
    getAllHospitalDiseaseGroup,
    getAllHospitalServices,
    getAllHospitalServicesWithDetails,
    getHospitalServiceDetails,
    createHospitalService,
    updateHospitalService,
    deleteHospitalService,
    getServicesByIds,
    getServicesByGroupId,
};
