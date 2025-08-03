import { useQuery } from "@tanstack/react-query";
import React from "react";
import { inventoryApis, InventoryLimitStock } from "../../infras";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse, IPagination } from "~/libs/axios/types";

export interface GetInventoryLimitStockListRequest {
    pageIndex: number;
    pageSize: number;
    searchKeyword?: string;
}

const transformData = (response: IBaseApiResponse<IPagination<InventoryLimitStock>>) => {
    return response.Data.data.map((item) => ({ ...item })) as InventoryLimitStock[];
};

export const useQueryGetInventoryLimitStocks = ({
    isEnabled,
    query,
}: {
    isEnabled: boolean;
    query: GetInventoryLimitStockListRequest;
}) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<InventoryLimitStock>>>({
        queryKey: [QueryKey.INVENTORY.GET_LIST_INVENTORY_LIMIT_STOCK, query],
        queryFn: () =>
            inventoryApis.getInventoryLimitStocks({
                pageIndex: query.pageIndex,
                pageSize: query.pageSize,
                searchKeyword: query.searchKeyword?.trim(),
            }),
        enabled: isEnabled,
        staleTime: 1000 * 60 * 1,
    });

    const inventoryLimitStocks = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { inventoryLimitStocks, totalItems },
        isLoading,
        isError,
        refetch,
    };
};
