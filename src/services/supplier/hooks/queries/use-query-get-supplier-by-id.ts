import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { Supplier } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";
import { supplierApi } from "../../infras";

const transformSuppliers = (response: IBaseApiResponse<Supplier>): Supplier => {
    return response.Data as Supplier;
};

export const useQueryGetSupplierById = (supplierId: number) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<Supplier>>({
        queryKey: [QueryKey.SUPPLIER.GET_SUPPLIER_BY_ID, supplierId],
        queryFn: () => supplierApi.getSupplierById(supplierId),
        enabled: !!supplierId,
    });

    const supplier = React.useMemo(() => {
        if (!response || isError || isLoading) return null;
        return transformSuppliers(response);
    }, [response, isError, isLoading]);

    return {
        data: supplier,
        isLoading,
        isError,
        refetch,
    };
};
