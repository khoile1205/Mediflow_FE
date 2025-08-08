import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { examinationApis } from "../../infras";
import { IBaseApiResponse } from "~/libs/axios/types";
import { Examination } from "~/entities";

export const useQueryPatientExaminationDetailByExaminationId = (examinationId: number) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<Examination>>({
        queryKey: [QueryKey.EXAMINATION.GET_PATIENT_EXAMINATION_DETAIL_BY_EXAMINATION_ID, examinationId],
        queryFn: async () => {
            const response = await examinationApis.getPatientExaminationDetailByExaminationId(examinationId);
            return response;
        },
        enabled: !!examinationId,
    });

    const patientExaminationDetail = React.useMemo(() => {
        if (isLoading || isError || !data) return null;
        return data.Data;
    }, [isLoading, isError, data]);

    return {
        data: { patientExaminationDetail },
        isLoading,
        isError,
        refetch,
    };
};

interface UseQueriesResult {
    data: (Examination | undefined)[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

export const useQueriesPatientExaminationDetailByExaminationId = (examinationIds: number[]): UseQueriesResult => {
    const queries = useQueries({
        queries: examinationIds.map((id) => ({
            queryKey: [QueryKey.EXAMINATION.GET_PATIENT_EXAMINATION_DETAIL_BY_EXAMINATION_ID, id],
            queryFn: () => examinationApis.getPatientExaminationDetailByExaminationId(id),
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
