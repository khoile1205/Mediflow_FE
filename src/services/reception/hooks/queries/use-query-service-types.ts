import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { receptionApis } from "../../infras";
import { ServiceType } from "~/entities/service-type.entity";
import React from "react";
import { IBaseApiResponse } from "~/libs/axios/types";

const transformData = (response: IBaseApiResponse<ServiceType[]>) => {
    return response.Data.map((item) => ({ ...item })) as ServiceType[];
};

export const useQueryServiceTypes = () => {
    const { data, isError, isLoading } = useQuery<IBaseApiResponse<ServiceType[]>>({
        queryKey: [QueryKey.RECEPTION.GET_SERVICE_TYPES],
        queryFn: async () => {
            return await receptionApis.getAllServiceTypes();
        },
    });

    const listServiceTypes = React.useMemo(() => {
        if (isError || isLoading || !data) return [];
        return transformData(data);
    }, [isError, isLoading, data]);

    return {
        data: listServiceTypes,
        isError,
        isLoading,
    };
};
