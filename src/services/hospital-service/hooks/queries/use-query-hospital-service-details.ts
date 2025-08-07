import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { hospitalServiceApis } from "../../infras";
import { Service } from "~/entities";

const transformServices = (response: IBaseApiResponse<Service[]>): Service[] => {
    return response.Data || [];
};

export const useQueryHospitalServicesWithDetails = () => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<Service[]>>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_DETAILS],
        queryFn: () => hospitalServiceApis.getAllHospitalServicesWithDetails(),
        staleTime: 1000 * 60 * 5,
    });

    const services = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformServices(response);
    }, [isError, isLoading, response]);

    return {
        data: { services },
        isError,
        isLoading,
        refetch,
    };
};
