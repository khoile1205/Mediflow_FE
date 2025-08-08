import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { receptionApis } from "../../infras";
import {
    ReceptionUnpaidService,
    ReceptionUnpaidServicesResponse,
    ReceptionVaccinationService,
} from "../../infras/types";

const transformData = (
    response: IBaseApiResponse<ReceptionUnpaidServicesResponse>,
): ReceptionUnpaidServicesResponse => {
    return response.Data;
};

export const useQueryReceptionUnpaidServices = (receptionId?: number) => {
    const { data, isError, isLoading } = useQuery<IBaseApiResponse<ReceptionUnpaidServicesResponse>>({
        queryKey: [QueryKey.RECEPTION.GET_UNPAID_SERVICES, receptionId],
        queryFn: async () => {
            return await receptionApis.getUnpaidServices(receptionId);
        },
        enabled: !!receptionId,
    });

    const unpaidServices = React.useMemo(() => {
        if (isError || isLoading || !data)
            return {
                services: [] as ReceptionUnpaidService[],
                vaccinations: [] as ReceptionVaccinationService[],
            };
        return transformData(data);
    }, [isError, isLoading, data]);

    return {
        data: unpaidServices,
        isError,
        isLoading,
    };
};
