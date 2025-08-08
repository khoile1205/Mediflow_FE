import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { hospitalServiceApis, ISearchParam } from "../../infras";
import { DiseaseGroup } from "~/entities";

const transformData = (response: IBaseApiResponse<DiseaseGroup[]>): DiseaseGroup[] => {
    return response.Data || [];
};

export const useQueryHospitalDiseaseGroup = (query: ISearchParam = { searchTerm: "" }) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<DiseaseGroup[]>>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_HOSPITAL_DISEASE_GROUP_LIST, query],
        queryFn: async () => {
            const patientApiResponse = await hospitalServiceApis.getAllHospitalDiseaseGroup(query);
            return patientApiResponse;
        },
        staleTime: 1000 * 60 * 5,
    });

    const hospitalDiseaseGroups = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: { hospitalDiseaseGroups },
        isError,
        isLoading,
        refetch,
    };
};
