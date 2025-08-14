import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { ExaminationService, hospitalServiceApis, ISearchParam } from "../../infras";

const transformData = (response: IBaseApiResponse<ExaminationService[]>): ExaminationService[] => {
    return response.Data || [];
};

export const useQueryExaminationService = (query: ISearchParam = { searchTerm: "" }) => {
    const {
        data: response,
        isLoading,
        isError,
        error,
        refetch,
        isPending,
        isSuccess,
        isFetching,
    } = useQuery<IBaseApiResponse<ExaminationService[]>, Error>({
        queryKey: [QueryKey.HOSPITAL_SERVICE.GET_ALL_EXAMINATION_SERVICE, query],
        queryFn: () => hospitalServiceApis.getAllExaminationServices(query),
        staleTime: 1000 * 60 * 5,
    });

    const examinationServices = useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    return {
        data: response,
        examinationServices,
        isLoading,
        isError,
        error,
        refetch,
        isPending,
        isSuccess,
        isFetching,
    };
};
