import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { Service } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";
import { hospitalServiceApis } from "../../infras";

const transformData = (response: IBaseApiResponse<Service[]>): Service[] => {
    return response.Data || [];
};

export const useQueryHospitalServices = () => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<Service[]>>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_LIST],
        queryFn: async () => {
            const patientApiResponse = await hospitalServiceApis.getAllHospitalServices();
            return patientApiResponse;
        },
        staleTime: 1000 * 60 * 5,
    });

    const hospitalServices = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: { hospitalServices },
        isError,
        isLoading,
        refetch,
    };
};
