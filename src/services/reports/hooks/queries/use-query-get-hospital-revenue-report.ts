import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { reportApis, TDateRangeReportRequest, THospitalRevenueReportResponse } from "../../infras";

const transformData = (response: IBaseApiResponse<THospitalRevenueReportResponse>): THospitalRevenueReportResponse => {
    // Transform the data as needed
    return response.Data;
};

export const useQueryGetHospitalRevenueReport = ({
    enabled,
    params,
}: {
    params: TDateRangeReportRequest;
    enabled: boolean;
}) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QueryKey.REPORT.GET_HOSPITAL_REVENUE, params],
        queryFn: () => reportApis.getHospitalRevenueReport(params),
        enabled,
    });

    const report = React.useMemo(() => {
        if (isError || isLoading || !data) return null;
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: report, isLoading, isError, refetch };
};
