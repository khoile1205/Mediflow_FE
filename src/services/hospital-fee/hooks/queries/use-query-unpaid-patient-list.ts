import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import { hospitalFeeApis, UnpaidPatientSummary } from "../../infras";
import React from "react";

const transformData = (response: IBaseApiResponse<UnpaidPatientSummary[]>): UnpaidPatientSummary[] => {
    return response.Data || [];
};
export const useQueryUnpaidPatientList = (params: ISearchParam = { searchTerm: "" }) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<UnpaidPatientSummary[]>>({
        queryKey: [QueryKey.HOSPITAL_FEE.GET_UNPAID_PATIENT_LIST, params],
        queryFn: () => hospitalFeeApis.getUnpaidPatientsList(params),
    });

    const unpaidPatientList = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: { unpaidPatientList }, isLoading, isError, refetch };
};
