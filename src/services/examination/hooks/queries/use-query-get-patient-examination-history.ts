import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { examinationApis, PatientExaminationHistory } from "../../infras";

const transformData = (response: IBaseApiResponse<PatientExaminationHistory>): PatientExaminationHistory => {
    return { ...response.Data } as PatientExaminationHistory;
};

export const useQueryGetPatientExaminationHistory = (patientId: number) => {
    const { data, error, isLoading, refetch } = useQuery<IBaseApiResponse<PatientExaminationHistory>>({
        queryKey: [QueryKey.EXAMINATION.GET_PATIENT_EXAMINATION_HISTORY, patientId],
        queryFn: async () => {
            const response = await examinationApis.getPatientExaminationHistory(patientId);
            return response;
        },
        enabled: !!patientId,
    });

    const patientExaminationHistory = React.useMemo(() => {
        if (isLoading || error || !data) return null;
        return transformData(data);
    }, [isLoading, error, data]);

    return {
        data: { patientExaminationHistory },
        error,
        isLoading,
        refetch,
    };
};
