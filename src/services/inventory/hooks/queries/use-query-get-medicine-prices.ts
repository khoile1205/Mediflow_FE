import { useQuery } from "@tanstack/react-query";
import { inventoryApis, MedicinePrice } from "../../infras";
import { QueryKey } from "~/constants/query-key";
import React from "react";
import { IBaseApiResponse, IPagination } from "~/libs/axios/types";

export interface GetMedicinePriceListRequest {
    pageIndex: number;
    pageSize: number;
    medicineId?: number;
}

const transformData = (response: IBaseApiResponse<IPagination<MedicinePrice>>) => {
    return response.Data.data.map((item) => ({ ...item })) as MedicinePrice[];
};

export const useQueryGetMedicinePrices = ({
    isEnabled,
    query,
}: {
    isEnabled: boolean;
    query: GetMedicinePriceListRequest;
}) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<MedicinePrice>>>({
        queryKey: [QueryKey.INVENTORY.GET_MEDICINE_PRICES_WITH_PAGINATION, query],
        queryFn: () => inventoryApis.getMedicinePrices(query),
        enabled: isEnabled,
        staleTime: 1000 * 60 * 1,
    });

    const medicinePrices = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { medicinePrices, totalItems },
        isLoading,
        isError,
        refetch,
    };
};
