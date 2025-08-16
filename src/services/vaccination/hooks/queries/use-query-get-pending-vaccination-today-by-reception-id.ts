import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { PendingVaccinationTodayResponse, vaccinationApis } from "../../infras";

const transformData = (
    response: IBaseApiResponse<PendingVaccinationTodayResponse>,
): PendingVaccinationTodayResponse => {
    return response.Data;
};

export const useQueryGetPendingVaccinationTodayByReceptionId = (receptionId?: number) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<PendingVaccinationTodayResponse>>({
        queryKey: [QueryKey.VACCINATION.GET_PENDING_VACCINATIONS_TODAY, receptionId],
        queryFn: () => vaccinationApis.getPendingVaccinationsToday(receptionId),
        enabled: !!receptionId,
    });

    const pendingVaccinations = React.useMemo(() => {
        if (isError || isLoading || !data)
            return {
                totalPendingDoses: 0,
                pendingVaccinations: [],
            };
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: { pendingVaccinations }, isLoading, isError, refetch };
};
