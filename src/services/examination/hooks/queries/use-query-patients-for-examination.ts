import { useQuery } from "@tanstack/react-query";
import { PatientForExamination } from "~/entities";
import { examinationApis } from "../../infras";
import React from "react";
import { IBaseApiResponse } from "~/libs/axios/types";
import { QueryKey } from "~/constants/query-key";

export const useQueryPatientsForExamination = (patientName?: string, isDiagnose?: boolean) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<PatientForExamination[]>>({
        queryKey: [QueryKey.EXAMINATION.GET_PATIENTS_FOR_EXAMINATION, patientName, isDiagnose],
        queryFn: async () => {
            const response = await examinationApis.getPatientsForExamination(patientName, isDiagnose);
            return response;
        },
    });

    const patientsForExamination = React.useMemo(() => {
        if (isError || isLoading || !data) return null;
        return data.Data;
    }, [isError, isLoading, data]);

    return {
        data: { patientsForExamination },
        isLoading,
        isError,
        refetch,
    };
};
