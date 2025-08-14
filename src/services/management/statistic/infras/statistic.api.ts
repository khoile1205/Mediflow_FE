import { endpoints } from "~/constants/endpoints";
import { OverviewStats } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";

const getOverview = async () => {
    return await callApi<OverviewStats>({
        url: endpoints.management.statisticEndpoints.getOverview,
        method: HttpMethod.GET,
    });
};

export const statisticApis = {
    getOverview,
};
