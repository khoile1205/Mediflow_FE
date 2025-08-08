import { useQuery } from "@tanstack/react-query";
import { inventoryApis } from "../../infras";
import { QueryKey } from "~/constants/query-key";
import React from "react";
import { Medicine } from "~/entities/medicine";
import { IBaseApiResponse, IPagination } from "~/libs/axios/types";

export interface GetMedicineListRequest {
    pageIndex: number;
    pageSize: number;
    name?: string;
    code?: string;
    searchKeyword?: string;
}

const transformData = (response: IBaseApiResponse<IPagination<Medicine>>) => {
    return response.Data.data.map((item) => ({ ...item })) as Medicine[];
};

export const useQueryGetMedicines = ({ isEnabled, query }: { isEnabled: boolean; query: GetMedicineListRequest }) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<Medicine>>>({
        queryKey: [QueryKey.INVENTORY.GET_LIST_WITH_PAGINATION, query],
        queryFn: () => {
            return inventoryApis.getMedicines({
                pageIndex: query.pageIndex,
                pageSize: query.pageSize,
                name: query.name?.trim(),
                code: query.code?.trim(),
                searchKeyword: query.searchKeyword?.trim(),
            });
        },
        enabled: isEnabled,
        staleTime: 1000 * 60 * 1,
    });

    const medicines = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { medicines, totalItems },
        isLoading,
        isError,
        refetch,
    };
};
