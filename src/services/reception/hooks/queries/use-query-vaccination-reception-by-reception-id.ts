import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { receptionApis } from "../../infras";
import { VaccinationIndicateReception } from "../../infras/types";

const transformData = (response: IBaseApiResponse<VaccinationIndicateReception[]>): VaccinationIndicateReception[] => {
    return response.Data;
};

export const useQueryVaccinationReceptionByReceptionId = (receptionId?: number) => {
    const { data, isLoading, isError } = useQuery<IBaseApiResponse<VaccinationIndicateReception[]>>({
        queryKey: [QueryKey.RECEPTION.GET_VACCINATION_RECEPTION_BY_RECEPTION_ID, receptionId],
        queryFn: async () => {
            return await receptionApis.getVaccinationReceptionByReceptionId(receptionId!);
        },
        enabled: !!receptionId,
    });

    const listVaccinations = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return { listVaccinations, isLoading, isError };
};
