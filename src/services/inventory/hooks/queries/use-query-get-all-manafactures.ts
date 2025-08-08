import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Manufacture } from "~/entities/medicine";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras";
import { IBaseApiResponse } from "~/libs/axios/types";

const transformManufacturers = (response: IBaseApiResponse<Manufacture[]>): Manufacture[] => {
    return response.Data || [];
};

export const useQueryGetAllManufacturers = () => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<Manufacture[]>>({
        queryKey: [QueryKey.INVENTORY.GET_ALL_MANUFACTURERS],
        queryFn: () => inventoryApis.getAllManufacturers(),
        staleTime: 1000 * 60 * 5,
    });

    const manufacturers = React.useMemo(() => {
        if (!response || isError || isLoading) return [];
        return transformManufacturers(response);
    }, [response, isError, isLoading]);

    return {
        data: { manufacturers },
        isLoading,
        isError,
        refetch,
    };
};
