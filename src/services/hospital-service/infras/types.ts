import { HospitalServiceGroup } from "~/pages/hospital-services/types";

export interface ISearchParam {
    pageIndex?: number;
    pageSize?: number;
    searchTerm?: string;
}

export interface CreateHospitalServiceGroupRequest {
    groupName: string;
    serviceIds: number[];
}

export interface UpdateHospitalServiceGroupRequest {
    id: number;
    groupName: string;
    description?: string;
    serviceIds?: number[];
}

export interface CreateHospitalServiceRequest {
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: number;
}

export interface UpdateHospitalServiceRequest {
    id: number;
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: number;
}

export interface AssignServicesToGroupRequest {
    serviceGroupId: number;
    serviceIds: number[];
}

export interface RemoveServicesFromGroupRequest {
    serviceGroupId: number;
    serviceIds: number[];
}
export interface PaginationResult<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export type HospitalServiceGroupListResponse = PaginationResult<HospitalServiceGroup>;
