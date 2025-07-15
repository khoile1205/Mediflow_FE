import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { PreExaminationMedicine } from "../../infras/types";
import { preExaminationApis } from "../../infras/pre-vaccination.api";

const transformData = (res: IBaseApiResponse<PreExaminationMedicine[]>): PreExaminationMedicine[] => {
    return res.Data;
};

export const useQueryPreExaminationMedicines = (receptionId?: number) => {
    const { data, isError, isLoading } = useQuery<IBaseApiResponse<PreExaminationMedicine[]>>({
        queryKey: [QueryKey.PRE_EXAMINATION.GET_MEDICINE_LIST, receptionId],
        queryFn: () => preExaminationApis.getPreExaminationMedicines(receptionId!),
        enabled: !!receptionId,
    });

    const medicines = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return {
        medicines,
        isLoading,
        isError,
    };
};
