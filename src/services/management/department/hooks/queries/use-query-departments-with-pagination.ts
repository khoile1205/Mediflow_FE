import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { Department } from "~/entities";
import { IBaseApiResponse, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { departmentApis } from "../../infras";

const transformData = (response: IBaseApiResponse<IPagination<Department>>) => {
    return response.Data.data.map((item) => ({ ...item })) as Department[];
};

export const useQueryDepartmentsWithPagination = (params: IPaginationRequest) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<Department>>>({
        queryKey: [QueryKey.PATIENT.GET_LIST_PATIENT_WITH_PAGINATION, params],
        queryFn: async () => {
            const patientApiResponse = await departmentApis.getDepartmentWithPagination({
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
            });
            return patientApiResponse;
        },
    });

    const listDepartments = React.useMemo(() => {
        if (isError || isLoading || !response) return [];
        return transformData(response);
    }, [isError, isLoading, response]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { listDepartments, totalItems },
        isError,
        isLoading,
        refetch,
    };
};
