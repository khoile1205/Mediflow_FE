import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import { receptionApis } from "../../infras";
import { AvailablePatientReception, AvailablePatientReceptionResponse } from "../../infras/types";

const transformData = (
    response: IBaseApiResponse<IPagination<AvailablePatientReceptionResponse>>,
): AvailablePatientReception[] => {
    return (
        response.Data.data.map((reception) => ({
            ...reception.patient,
            receptionId: reception.receptionId,
            receptionDate: new Date(reception.receptionDate),
            lastUpdatedAt: new Date(reception.lastUpdatedAt),
            serviceTypeId: reception.serviceTypeId,
        })) || []
    );
};

export const useQueryGetAvailablePatientReceptions = (params: IPaginationRequest & ISearchParam) => {
    const { data, isError, isLoading } = useQuery<IBaseApiResponse<IPagination<AvailablePatientReceptionResponse>>>({
        queryKey: [QueryKey.RECEPTION.GET_AVAILABLE_PATIENT_RECEPTIONS, params],
        queryFn: async () => {
            return await receptionApis.getAvailablePatientReceptions(params);
        },
    });

    const availableReceptions = React.useMemo(() => {
        if (isError || isLoading || !data) return null;
        return transformData(data);
    }, [isError, isLoading, data]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !data) return 0;
        return data.Data.totalItems;
    }, [isError, isLoading, data]);

    return {
        data: availableReceptions,
        isError,
        isLoading,
        totalItems,
    };
};
