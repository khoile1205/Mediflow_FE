import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { MedicineBatchExpiredReturn } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";
import { inventoryApis } from "../../infras";

const transformData = (response: IBaseApiResponse<MedicineBatchExpiredReturn>) => {
    return response.Data;
};

export const useQueryGetMedicineBatchReturnFormDetail = (id: number) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<MedicineBatchExpiredReturn>>({
        queryKey: [QueryKey.INVENTORY.GET_EXPIRED_MEDICINE_BATCH_FORM_BY_ID, id],
        queryFn: async () => {
            const expiredMedicineBatchForms = await inventoryApis.getExpiredMedicineBatchFormById(id);
            return expiredMedicineBatchForms;
        },
        enabled: !!id,
    });

    const medicineBatchReturnForm = React.useMemo(() => {
        if (isError || isLoading || !response) return null;
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: medicineBatchReturnForm,
        isError,
        isLoading,
        refetch,
    };
};
