import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { postVaccinationApis } from "../../infras/post-vaccination.api";
import { PostVaccinationPatient } from "../../infras/types";

const transformData = (response: IBaseApiResponse<PostVaccinationPatient[]>): PostVaccinationPatient[] => {
    return response.Data;
};

export const useQueryPostVaccinationPatients = (patientName?: string) => {
    const { data, isError, isLoading } = useQuery<IBaseApiResponse<PostVaccinationPatient[]>>({
        queryKey: [QueryKey.POST_VACCINATION.GET_PATIENT_LIST, patientName],
        queryFn: () => postVaccinationApis.getPostVaccinationPatients(patientName),
    });

    const patients = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return {
        patients,
        isLoading,
        isError,
    };
};
