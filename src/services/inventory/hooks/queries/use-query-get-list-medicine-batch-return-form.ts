import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse, IPagination } from "~/libs/axios/types";
import { IGetListMedicineBatchesReturnFormRequest, inventoryApis } from "../../infras";
import { MedicineBatchExpiredReturn } from "~/entities";

const transformData = (
    response: IBaseApiResponse<IPagination<MedicineBatchExpiredReturn>>,
): MedicineBatchExpiredReturn[] => {
    return response.Data.data.map((item) => ({ ...item })) as MedicineBatchExpiredReturn[];
};

export const useQueryGetListMedicineBatchReturnForm = (params: IGetListMedicineBatchesReturnFormRequest) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<MedicineBatchExpiredReturn>>>({
        queryKey: [QueryKey.INVENTORY.GET_ALL_EXPIRED_MEDICINE_BATCHES, params],
        queryFn: async () => {
            const expiredMedicineBatchForms = await inventoryApis.getAllExpiredMedicineBatchForm(params);
            return expiredMedicineBatchForms;
        },
    });

    const medicineBatchReturnForms = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { medicineBatchReturnForms, totalItems },
        isError,
        isLoading,
        refetch,
    };
};
