import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { examinationApis } from "../../infras";
import { ServiceTestParameter } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";

export const useQueryServiceTestParametersOfExaminationByExaminationId = (examinationId: number) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<ServiceTestParameter[]>>({
        queryKey: [QueryKey.EXAMINATION.GET_SERVICE_TEST_PARAMETERS_OF_EXAMINATION_BY_EXAMINATION_ID, examinationId],
        queryFn: async () => {
            const response = await examinationApis.getServiceTestParametersOfExaminationByExaminationId(examinationId);
            return response;
        },
        enabled: !!examinationId,
    });

    const serviceTestParameters = React.useMemo(() => {
        if (isLoading || isError || !data) return null;
        return data.Data;
    }, [isLoading, isError, data]);

    return {
        data: { serviceTestParameters },
        isLoading,
        isError,
        refetch,
    };
};

interface UseQueriesResult {
    data: (ServiceTestParameter[] | undefined)[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

export const useQueriesServiceTestParametersOfExaminationByExaminationId = (
    examinationIds: number[],
): UseQueriesResult => {
    const queries = useQueries({
        queries: examinationIds.map((id) => ({
            queryKey: [QueryKey.EXAMINATION.GET_SERVICE_TEST_PARAMETERS_OF_EXAMINATION_BY_EXAMINATION_ID, id],
            queryFn: () => examinationApis.getServiceTestParametersOfExaminationByExaminationId(id),
            enabled: !!id,
        })),
    });

    return {
        data: queries.map((query) => query.data?.Data),
        isLoading: queries.some((query) => query.isLoading),
        isError: queries.some((query) => query.isError),
        refetch: () => queries.forEach((query) => query.refetch()),
    };
};
