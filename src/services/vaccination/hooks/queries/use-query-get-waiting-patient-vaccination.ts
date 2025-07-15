import React from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import { WaitingPatientVaccination, vaccinationApis } from "../../infras";

const transformData = (response: IBaseApiResponse<WaitingPatientVaccination[]>): WaitingPatientVaccination[] => {
    return response.Data || [];
};
export const useQueryGetWaitingPatientVaccination = (params: ISearchParam = { searchTerm: "" }) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<WaitingPatientVaccination[]>>({
        queryKey: [QueryKey.VACCINATION.GET_WAITING_PATIENT_VACCINATION_LIST, params],
        queryFn: () => vaccinationApis.getWaitingPatientVaccinationList(params),
    });

    const waitingPatientList = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: { waitingPatientList }, isLoading, isError, refetch };
};
