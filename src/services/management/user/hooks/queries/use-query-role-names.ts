import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { userApis } from "../../infras";
import { IBaseApiResponse } from "~/libs/axios/types";
import React from "react";

export const useQueryRoleNames = () => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<string[]>>({
        queryKey: [QueryKey.USER.GET_ROLE_NAMES],
        queryFn: async () => {
            const response = await userApis.getRoleNames();
            return response;
        },
    });

    const roleNames = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return response.Data;
    }, [isError, isLoading, response]);

    return {
        data: { roleNames },
        isError,
        isLoading,
        refetch,
    };
};
