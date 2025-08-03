import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { Supplier } from "~/entities";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { inventoryApis } from "../../../inventory/infras";
import { ISearchParam } from "~/services/hospital-service/infras";

const transformSuppliers = (response: IBaseApiResponse<IPagination<Supplier>>): Supplier[] => {
    return response.Data.data.map((item) => ({ ...item })) as Supplier[];
};

export const useQueryGetListSupplier = (query: IPaginationRequest & ISearchParam) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<Supplier>>>({
        queryKey: [QueryKey.SUPPLIER.GET_LIST_SUPPLIER, query],
        queryFn: () => inventoryApis.getListSupplier(query),
    });

    const suppliers = React.useMemo(() => {
        if (!response || isError || isLoading) return [];
        return transformSuppliers(response);
    }, [response, isError, isLoading]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { suppliers, totalItems },
        isLoading,
        isError,
        refetch,
    };
};
