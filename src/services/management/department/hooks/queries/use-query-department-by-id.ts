import React from "react";
import { QueryKey } from "~/constants/query-key";
import { departmentApis } from "../../infras";
import { useQuery } from "@tanstack/react-query";
import { Department } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";

export const useQueryDepartmentById = (departmentId: number) => {
    const { data, isLoading, isError, refetch } = useQuery<IBaseApiResponse<Department>>({
        queryKey: [QueryKey.DEPARTMENT.GET_DEPARTMENT_BY_ID, departmentId],
        queryFn: async () => {
            const response = await departmentApis.getDepartmentById(departmentId);
            return response;
        },
        enabled: !!departmentId,
    });

    const department = React.useMemo(() => {
        if (isError || isLoading || !data) return null;
        return data.Data;
    }, [isError, isLoading, data]);

    return {
        data: { department },
        isLoading,
        isError,
        refetch,
    };
};
