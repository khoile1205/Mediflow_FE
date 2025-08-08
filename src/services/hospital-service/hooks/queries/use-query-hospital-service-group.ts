import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { ServiceGroup } from "~/entities/hospital-service.entity";
import { IBaseApiResponse } from "~/libs/axios/types";
import { hospitalServiceApis, ISearchParam } from "../../infras";

const transformData = (response: IBaseApiResponse<ServiceGroup[]>): ServiceGroup[] => {
    return response.Data || [];
};

export const useQueryHospitalServiceGroup = (query: ISearchParam = { searchTerm: "" }) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<ServiceGroup[]>>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_GROUP_LIST, query],
        queryFn: async () => {
            const patientApiResponse = await hospitalServiceApis.getAllHospitalServiceGroup(query);
            return patientApiResponse;
        },
        staleTime: 1000 * 60 * 5,
    });

    const hospitalServiceGroups = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: { hospitalServiceGroups },
        isError,
        isLoading,
        refetch,
    };
};
