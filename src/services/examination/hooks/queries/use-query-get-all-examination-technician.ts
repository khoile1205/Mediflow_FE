import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { examinationApis } from "../../infras";
import { ExaminationTechnician } from "~/entities";

export const useQueryGetAllExaminationTechnician = () => {
    const { data, error, isLoading, refetch } = useQuery<IBaseApiResponse<ExaminationTechnician[]>>({
        queryKey: [QueryKey.EXAMINATION.GET_ALL_EXAMINATION_TECHNICIAN],
        queryFn: async () => {
            const response = await examinationApis.getAllExaminationTechnician();
            return response;
        },
    });

    const examinationTechnicians = React.useMemo(() => {
        if (isLoading || error || !data) return null;
        return data.Data;
    }, [isLoading, error, data]);

    return {
        data: { examinationTechnicians },
        error,
        isLoading,
        refetch,
    };
};
