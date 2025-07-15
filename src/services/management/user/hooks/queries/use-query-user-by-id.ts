import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { User } from "~/entities/user";
import { userApis } from "../../infras";
import { IBaseApiResponse } from "~/libs/axios/types";
import React from "react";

export const useQueryUserById = (id: number) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<User>>({
        queryKey: [QueryKey.USER.GET_USER_BY_ID, id],
        queryFn: async () => {
            const response = await userApis.getUserById(id);
            return response;
        },
        enabled: !!id,
    });

    const user = React.useMemo(() => {
        if (isError || isLoading || !response) return null;
        return response.Data;
    }, [isError, isLoading, response]);

    return {
        data: { user },
        isError,
        isLoading,
        refetch,
    };
};
