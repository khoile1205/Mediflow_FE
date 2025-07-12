import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { receptionApis } from "../../infras";

const transformData = (response: IBaseApiResponse<number>): number => {
    return response.Data;
};

export const useQueryGetLatestReceptionIdByPatientId = (patientId?: number) => {
    const { data, isError, isLoading } = useQuery<IBaseApiResponse<number>>({
        queryKey: [QueryKey.RECEPTION.GET_LATEST_RECEPTION_ID_BY_PATIENT_ID, patientId],
        queryFn: async () => {
            return await receptionApis.getLatestReceptionIdByPatientId(patientId);
        },
        enabled: !!patientId,
    });

    const latestReceptionId = React.useMemo(() => {
        if (isError || isLoading || !data) return null;
        return transformData(data);
    }, [isError, isLoading, data]);

    return {
        data: latestReceptionId,
        isError,
        isLoading,
    };
};
