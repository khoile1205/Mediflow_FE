import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { examinationApis, ExaminationHistoryDetail } from "../../infras";

const transformData = (response: IBaseApiResponse<ExaminationHistoryDetail>): ExaminationHistoryDetail => {
    return { ...response.Data } as ExaminationHistoryDetail;
};

export const useQueryGetExaminationHistoryDetailById = (examinationId: number) => {
    const { data, error, isLoading, refetch } = useQuery<IBaseApiResponse<ExaminationHistoryDetail>>({
        queryKey: [QueryKey.EXAMINATION.GET_EXAMINATION_HISTORY_DETAIL_BY_ID, examinationId],
        queryFn: async () => {
            const response = await examinationApis.getExaminationHistoryDetailById(examinationId);
            return response;
        },
        enabled: !!examinationId,
    });

    const examinationHistory = React.useMemo(() => {
        if (isLoading || error || !data) return null;
        return transformData(data);
    }, [isLoading, error, data]);

    return {
        data: { examinationHistory },
        error,
        isLoading,
        refetch,
    };
};
