import { endpoints } from "~/constants/endpoints";
import { Staff } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { StaffFormValues } from "~/pages/management/users/types";

const getUsersWithPagination = async ({ pageIndex = 1, pageSize = 10 }: IPaginationRequest, keyword?: string) => {
    return await callApi<IPagination<Staff>>({
        url: endpoints.management.userEndpoints.getUsersWithPagination,
        method: HttpMethod.GET,
        params: { pageIndex, pageSize, keyword },
    });
};

const getUserById = async (id: number) => {
    return await callApi<Staff>({
        url: endpoints.management.userEndpoints.getUserById(id),
        method: HttpMethod.GET,
    });
};

const createUser = async (payload: StaffFormValues) => {
    return await callApi<StaffFormValues>({
        url: endpoints.management.userEndpoints.createUser,
        method: HttpMethod.POST,
        data: payload,
    });
};

const updateUser = async (payload: StaffFormValues) => {
    return await callApi<StaffFormValues>({
        url: endpoints.management.userEndpoints.updateUser(payload.id!),
        method: HttpMethod.PUT,
        data: payload,
    });
};

const deleteUser = async (id: number) => {
    return await callApi<void>({
        url: endpoints.management.userEndpoints.deleteUser(id),
        method: HttpMethod.DELETE,
    });
};

const getRoleNames = async () => {
    return await callApi<string[]>({
        url: endpoints.management.roleEndpoints.getRoleNames,
        method: HttpMethod.GET,
    });
};

export const userApis = {
    getUsersWithPagination,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getRoleNames,
};
