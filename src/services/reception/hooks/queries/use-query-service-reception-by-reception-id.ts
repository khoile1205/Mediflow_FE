import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { receptionApis } from "../../infras";
import { VaccinationServiceReception } from "../../infras/types";

const transformData = (response: IBaseApiResponse<VaccinationServiceReception[]>): VaccinationServiceReception[] => {
    return response.Data;
};

export const useQueryServiceReceptionByReceptionId = (receptionId?: number) => {
    const { data, isLoading, isError } = useQuery<IBaseApiResponse<VaccinationServiceReception[]>>({
        queryKey: [QueryKey.RECEPTION.GET_SERVICE_RECEPTION_BY_RECEPTION_ID, receptionId],
        queryFn: async () => {
            return await receptionApis.getServiceReceptionByReceptionId(receptionId!);
        },
        enabled: !!receptionId,
    });

    const listServiceReception = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return { listServiceReception, isLoading, isError };
};
