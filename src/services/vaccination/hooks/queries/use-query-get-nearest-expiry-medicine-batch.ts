import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { GetNearestExpiryMedicineBatchResponse, NearestExpiryMedicineBatch, vaccinationApis } from "../../infras";

const transformData = (
    response: IBaseApiResponse<GetNearestExpiryMedicineBatchResponse>,
): NearestExpiryMedicineBatch[] => {
    return response.Data.medicineBatches || [];
};
export const useQueryGetNearestExpiryMedicineBatch = (medicineId?: number) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<GetNearestExpiryMedicineBatchResponse>>({
        queryKey: [QueryKey.VACCINATION.GET_NEAREST_EXPIRY_MEDICINE_BATCH, medicineId],
        queryFn: () => vaccinationApis.getNearestExpiryMedicineBatch(medicineId),
        enabled: !!medicineId,
    });

    const nearestExpiryMedicineBatch = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: { nearestExpiryMedicineBatch }, isLoading, isError, refetch };
};
