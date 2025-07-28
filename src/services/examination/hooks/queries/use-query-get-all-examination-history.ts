import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import { examinationApis, PatientExaminationSummary } from "../../infras";

const transformData = (response: IBaseApiResponse<IPagination<PatientExaminationSummary>>) => {
    return response.Data.data.map((item) => ({ ...item })) as PatientExaminationSummary[];
};

export const useQueryGetAllExaminationHistory = (params: IPaginationRequest & ISearchParam) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<PatientExaminationSummary>>>({
        queryKey: [QueryKey.EXAMINATION.GET_ALL_EXAMINATION_HISTORY, params],
        queryFn: async () => {
            const response = await examinationApis.getAllExaminationHistory({
                ...params,
            });
            return response;
        },
        enabled: true,
    });

    const listExaminationHistory = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { listExaminationHistory, totalItems },
        isError,
        isLoading,
        refetch,
    };
};
