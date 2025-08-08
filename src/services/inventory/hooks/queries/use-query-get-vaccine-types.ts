import { useQuery } from "@tanstack/react-query";
import React from "react";
import { inventoryApis, VaccineType } from "../../infras";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";

const transformData = (response: IBaseApiResponse<VaccineType[]>): VaccineType[] => {
    return response.Data.map((item) => ({ ...item }));
};

export const useQueryGetVaccineTypes = () => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<VaccineType[]>>({
        queryKey: [QueryKey.INVENTORY.GET_VACCINE_TYPES],
        queryFn: () => inventoryApis.getVaccineTypes(),
        staleTime: 1000 * 60,
    });

    const vaccineTypes = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: vaccineTypes,
        isLoading,
        isError,
        refetch,
    };
};
