import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { receptionApis } from "../../infras";
import { VaccinationPrescreeningResponse } from "../../infras/types";

const transformData = (
    response: IBaseApiResponse<VaccinationPrescreeningResponse>,
): VaccinationPrescreeningResponse => {
    return response.Data || null;
};

export const useQueryGetPrevaccinationByReceptionId = (receptionId?: number) => {
    const { data, isError, isLoading } = useQuery<IBaseApiResponse<VaccinationPrescreeningResponse>>({
        queryKey: [QueryKey.RECEPTION.GET_PRE_VACCINATION_BY_RECEPTION_ID, receptionId],
        queryFn: async () => {
            return await receptionApis.getPrevaccinationByReceptionId(receptionId);
        },
        enabled: !!receptionId,
    });

    const availableReceptions = React.useMemo(() => {
        if (isError || isLoading || !data) return null;
        return transformData(data);
    }, [isError, isLoading, data]);

    return {
        data: availableReceptions,
        isError,
        isLoading,
    };
};
