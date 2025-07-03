import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { Medicine } from "~/entities";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { medicineApis } from "../../infras";
import { IGetMedicineSearchParam } from "../../infras/types";

const transformData = (response: IBaseApiResponse<IPagination<Medicine>>) => {
    return response.Data.data.map((item) => ({ ...item })) as Medicine[];
};

export const useQueryGetMedicinesWithPagination = (params: IPaginationRequest & IGetMedicineSearchParam) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<Medicine>>>({
        queryKey: [QueryKey.PATIENT.GET_LIST_PATIENT_WITH_PAGINATION, params],
        queryFn: async () => {
            const patientApiResponse = await medicineApis.getMedicinesWithPagination({
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                searchKeyword: params.searchKeyword,
            });
            return patientApiResponse;
        },
    });

    const listMedicines = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { listMedicines, totalItems },
        isError,
        isLoading,
        refetch,
    };
};
