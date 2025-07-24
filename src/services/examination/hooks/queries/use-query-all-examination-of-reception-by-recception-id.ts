import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { examinationApis } from "../../infras";
import React from "react";
import { IBaseApiResponse } from "~/libs/axios/types";
import { ExaminationOfReception } from "~/entities";

export const useQueryAllExaminationOfReceptionByReceptionId = (receptionId: number) => {
    const { data, error, isLoading, refetch } = useQuery<IBaseApiResponse<ExaminationOfReception[]>>({
        queryKey: [QueryKey.EXAMINATION.GET_ALL_EXAMINATION_OF_RECEPTION_BY_RECEPTION_ID, receptionId],
        queryFn: async () => {
            const response = await examinationApis.getAllExaminationOfReceptionByReceptionId(receptionId);
            return response;
        },
        enabled: !!receptionId,
    });

    const examinationsOfReception = React.useMemo(() => {
        if (isLoading || error || !data) return null;
        return data.Data;
    }, [isLoading, error, data]);

    return {
        data: { examinationsOfReception },
        error,
        isLoading,
        refetch,
    };
};
