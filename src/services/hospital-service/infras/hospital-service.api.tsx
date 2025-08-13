import { endpoints } from "~/constants/endpoints";
import { DiseaseGroup, Service, ServiceGroup } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IBaseApiResponse } from "~/libs/axios/types";
import {
    AssignServicesToGroupRequest,
    CreateExaminationServiceRequest,
    CreateHospitalServiceGroupRequest,
    CreateHospitalServiceRequest,
    ExaminationService,
    HospitalServiceGroupListResponse,
    ISearchParam,
    UpdateExaminationServiceRequest,
    UpdateHospitalServiceGroupRequest,
    UpdateHospitalServiceRequest,
} from "./types";
import { HospitalServiceGroup } from "~/pages/hospital-services/types";
import { HospitalServiceType } from "~/constants/enums";

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

const getAllHospitalServices = async (params: { serviceType?: HospitalServiceType } = {}) => {
    return await callApi<Service[]>({
        url: endpoints.hospitalService.serviceEndpoints.getAll,
        method: HttpMethod.GET,
        params,
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

const getAllExaminationServices = async (params?: ISearchParam) => {
    return await callApi<ExaminationService[]>({
        url: endpoints.hospitalService.examinationServiceEndpoints.getAll,
        method: HttpMethod.GET,
        params,
    });
};

const createExaminationService = async (data: CreateExaminationServiceRequest) => {
    return await callApi({
        url: endpoints.hospitalService.examinationServiceEndpoints.create,
        method: HttpMethod.POST,
        data,
    });
};

const updateExaminationService = async (id: number, data: UpdateExaminationServiceRequest) => {
    return await callApi({
        url: endpoints.hospitalService.examinationServiceEndpoints.update(id),
        method: HttpMethod.PUT,
        data,
    });
};

const getServiceTestParametersByExaminationId = async (examinationId: number, serviceType: string) => {
    return await callApi({
        url: endpoints.hospitalService.examinationReceptionEndpoints.getServiceTestParametersByExaminationId(
            examinationId,
        ),
        method: HttpMethod.GET,
        params: {
            serviceType,
        },
    });
};

const deleteExaminationService = async (id: number) => {
    return await callApi({
        url: endpoints.hospitalService.examinationServiceEndpoints.delete(id),
        method: HttpMethod.DELETE,
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
    getAllExaminationServices,
    createExaminationService,
    updateExaminationService,
    deleteExaminationService,
    getServiceTestParametersByExaminationId,
};
