import { useQuery } from "@tanstack/react-query";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { userApis } from "../../infras";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { Staff } from "~/entities";

const transformData = (response: IBaseApiResponse<IPagination<Staff>>) => {
    return response.Data.data.map((item) => ({ ...item })) as Staff[];
};

export const useQueryUsersWithPagination = (params: IPaginationRequest, keyword?: string) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<Staff>>>({
        queryKey: [QueryKey.USER.GET_LIST_USERS_WITH_PAGINATION, params, keyword],
        queryFn: async () => {
            const response = await userApis.getUsersWithPagination(
                {
                    pageIndex: params.pageIndex,
                    pageSize: params.pageSize,
                },
                keyword,
            );
            return response;
        },
    });

    const listUsers = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { listUsers, totalItems },
        isError,
        isLoading,
        refetch,
    };
};
