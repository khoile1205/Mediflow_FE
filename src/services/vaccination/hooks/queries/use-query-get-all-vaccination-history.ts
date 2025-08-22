import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { vaccinationApis, VaccinationHistoryItem } from "../../infras";

export const useQueryGetAllVaccinationHistory = (
    { pageIndex = 1, pageSize = 10 }: IPaginationRequest,
    fromDate?: string,
    toDate?: string,
    searchTerm?: string,
) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<VaccinationHistoryItem>>>({
        queryKey: [QueryKey.VACCINATION.GET_ALL_VACCINATION_HISTORY, pageIndex, pageSize, fromDate, toDate, searchTerm],
        queryFn: async () => {
            const response = await vaccinationApis.getAllVaccinationHistory(
                { pageIndex, pageSize },
                fromDate,
                toDate,
                searchTerm,
            );
            return response;
        },
    });

    const vaccinationHistory = React.useMemo(() => {
        if (isError || isLoading || !response)
            return {
                pageIndex: 1,
                pageSize: 10,
                totalItems: 0,
                totalPages: 0,
                hasPreviousPage: false,
                hasNextPage: false,
                data: [] as VaccinationHistoryItem[],
            };
        // Return the pagination data structure
        return (
            response.Data || {
                pageIndex: 1,
                pageSize: 10,
                totalItems: 0,
                totalPages: 0,
                hasPreviousPage: false,
                hasNextPage: false,
                data: [] as VaccinationHistoryItem[],
            }
        );
    }, [isError, isLoading, response]);

    return { data: { vaccinationHistory }, isLoading, isError, refetch };
};
