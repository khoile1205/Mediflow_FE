import { OverviewStats } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";
import { statisticApis } from "../../infras";
import { QueryKey } from "~/constants/query-key";
import React from "react";
import { useQuery } from "@tanstack/react-query";

export const useQueryOverview = () => {
    const { data, isLoading, error, refetch } = useQuery<IBaseApiResponse<OverviewStats>>({
        queryKey: [QueryKey.STATISTIC.GET_OVERVIEW],
        queryFn: async () => {
            const response = await statisticApis.getOverview();
            return response;
        },
    });

    const statisticOverview = React.useMemo(() => {
        if (!data) return null;
        return data.Data;
    }, [data]);

    return {
        data: { statisticOverview },
        isLoading,
        error,
        refetch,
    };
};
