import { endpoints } from "~/constants/endpoints";
import { Department } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IPagination, IPaginationRequest } from "~/libs/axios/types";

const getDepartmentWithPagination = async ({ pageIndex = 1, pageSize = 10 }: IPaginationRequest) => {
    return await callApi<IPagination<Department>>({
        url: endpoints.management.departmentEndpoints.getDepartmentWithPagination,
        method: HttpMethod.GET,
        params: { pageIndex, pageSize },
    });
};

export const departmentApis = {
    getDepartmentWithPagination,
};
