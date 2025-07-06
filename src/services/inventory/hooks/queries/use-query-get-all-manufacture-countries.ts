import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { ManufactureCountry } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";
import { inventoryApis } from "../../infras";

const transformCountries = (response: IBaseApiResponse<ManufactureCountry[]>): ManufactureCountry[] => {
    return response.Data || [];
};

export const useQueryGetAllManufactureCountries = () => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<ManufactureCountry[]>>({
        queryKey: [QueryKey.INVENTORY.GET_ALL_MANUFACTURE_COUNTRIES],
        queryFn: () => inventoryApis.getAllManufactureCountries(),
        staleTime: 1000 * 60 * 5,
    });

    const countries = React.useMemo(() => {
        if (!response || isError || isLoading) return [];
        return transformCountries(response);
    }, [response, isError, isLoading]);

    return {
        data: { countries },
        isLoading,
        isError,
        refetch,
    };
};
