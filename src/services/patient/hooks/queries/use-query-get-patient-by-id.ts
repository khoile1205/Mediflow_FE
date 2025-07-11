import { useQuery } from "@tanstack/react-query";
import { patientApi } from "../../infras/patient.api";
import { Patient } from "~/entities/person-info.entity";
import { IBaseApiResponse } from "~/libs/axios/types";
import { QueryKey } from "~/constants/query-key";
import React from "react";

const transformData = (response: IBaseApiResponse<Patient>) => {
    return { ...response.Data } as Patient;
};

export const useQueryGetPatientById = ({ patientId }: { patientId: number }) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<Patient>>({
        queryKey: [QueryKey.PATIENT.GET_PATIENT_BY_ID, patientId],
        queryFn: async () => {
            const patientApiResponse = await patientApi.getPatientById(patientId);
            return patientApiResponse;
        },
        enabled: !!patientId,
    });

    const patient = React.useMemo(() => {
        if (isError || isLoading || !response) return null;
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: patient,
        isError,
        isLoading,
        refetch,
    };
};
