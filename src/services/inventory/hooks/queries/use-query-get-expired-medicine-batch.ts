import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { MedicineBatch } from "~/entities";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import { inventoryApis } from "../../infras";

const transformData = (response: IBaseApiResponse<IPagination<MedicineBatch>>) => {
    return response.Data.data.map((item) => ({ ...item })) as MedicineBatch[];
};

export const useQueryGetExpiredMedicineBatchBatch = (params: IPaginationRequest & ISearchParam) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<MedicineBatch>>>({
        queryKey: [QueryKey.INVENTORY.GET_EXPIRY_MEDICINE_BATCH, params],
        queryFn: async () => {
            const patientApiResponse = await inventoryApis.getExpiryMedicineBatch(params);
            return patientApiResponse;
        },
    });

    const listMedicineBatches = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { listMedicineBatches, totalItems },
        isError,
        isLoading,
        refetch,
    };
};
