import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { hospitalServiceApis, ISearchParam } from "../../infras";
import { ServiceGroup } from "~/entities";

const transformServiceGroups = (response: IBaseApiResponse<ServiceGroup[]>): ServiceGroup[] => {
    return response.Data || [];
};

export const useQueryAllHospitalServiceGroup = (query: ISearchParam = { searchTerm: "" }) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<ServiceGroup[]>>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_SERVICE_GROUP_ALL, query],
        queryFn: () => hospitalServiceApis.getAllHospitalServiceGroup(query),
        staleTime: 1000 * 60 * 5,
    });

    const serviceGroups = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformServiceGroups(response);
    }, [isError, isLoading, response]);

    return {
        data: { serviceGroups },
        isError,
        isLoading,
        refetch,
    };
};
