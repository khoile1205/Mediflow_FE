import { endpoints } from "~/constants/endpoints";
import { Department, DepartmentType } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { DepartmentFormValues } from "~/pages/management/departments/types";

const getDepartmentWithPagination = async ({ pageIndex = 1, pageSize = 10 }: IPaginationRequest) => {
    return await callApi<IPagination<Department>>({
        url: endpoints.management.departmentEndpoints.getDepartmentWithPagination,
        method: HttpMethod.GET,
        params: { pageIndex, pageSize },
    });
};

const getDepartmentTypes = async () => {
    return await callApi<DepartmentType[]>({
        url: endpoints.management.departmentEndpoints.getDepartmentTypes,
        method: HttpMethod.GET,
    });
};

const getDepartmentById = async (departmentId: number) => {
    return await callApi<Department>({
        url: endpoints.management.departmentEndpoints.getDepartmentById(departmentId),
        method: HttpMethod.GET,
    });
};

const createDepartment = async (payload: DepartmentFormValues) => {
    return await callApi<DepartmentFormValues>({
        url: endpoints.management.departmentEndpoints.createDepartment,
        method: HttpMethod.POST,
        data: payload,
    });
};

const updateDepartment = async (payload: DepartmentFormValues) => {
    return await callApi<DepartmentFormValues>({
        url: endpoints.management.departmentEndpoints.updateDepartment(payload.id!),
        method: HttpMethod.PUT,
        data: payload,
    });
};

export const departmentApis = {
    getDepartmentWithPagination,
    getDepartmentTypes,
    getDepartmentById,
    createDepartment,
    updateDepartment,
};
