import { endpoints } from "~/constants/endpoints";
import { Department, DepartmentType } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IPagination, IPaginationRequest } from "~/libs/axios/types";

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

export const departmentApis = {
    getDepartmentWithPagination,
};
