import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { vaccinationApis, VaccinationHistoryResponse } from "../../infras";

export const useQueryGetVaccinationHistoryByPatientId = (patientId?: number) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<VaccinationHistoryResponse>>({
        queryKey: [QueryKey.VACCINATION.GET_VACCINATION_HISTORY_BY_PATIENT_ID, patientId],
        queryFn: async () => {
            const response = await vaccinationApis.getVaccinationHistoryByPatientId(patientId);
            return response;
        },
        enabled: !!patientId,
    });

    const vaccinationHistory = React.useMemo(() => {
        if (isError || isLoading || !response) return null;
        return response.Data;
    }, [isError, isLoading, response]);

    return { data: { vaccinationHistory }, isLoading, isError, refetch };
};
