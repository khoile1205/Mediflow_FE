import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { DepartmentType } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";
import { departmentApis } from "../../infras";
import React from "react";

export const useQueryDepartmentTypes = () => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<DepartmentType[]>>({
        queryKey: [QueryKey.DEPARTMENT.GET_LIST_DEPARTMENT_TYPES],
        queryFn: async () => {
            const response = await departmentApis.getDepartmentTypes();
            return response;
        },
    });

    const listDepartmentTypes = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return data.Data;
    }, [isError, isLoading, data]);

    return {
        data: { listDepartmentTypes },
        isLoading,
        isError,
        refetch,
    };
};
