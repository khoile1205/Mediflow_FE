import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { inventoryApis } from "../../infras";

const transformData = (response: IBaseApiResponse<string>) => {
    return response.Data;
};

export const useQueryGenerateExpiredReturnCode = (enabled: boolean) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<string>>({
        queryKey: [QueryKey.INVENTORY.GENERATE_EXPIRY_RETURN_CODE],
        queryFn: async () => {
            const patientApiResponse = await inventoryApis.generateExpiryReturnCode();
            return patientApiResponse;
        },
        enabled,
        staleTime: 0,
    });

    const expiredReturnCode = React.useMemo(() => {
        if (isError || isLoading || !response) return "";
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: { expiredReturnCode },
        isError,
        isLoading,
        refetch,
    };
};
