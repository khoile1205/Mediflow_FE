import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { IBaseApiResponse } from "~/libs/axios/types";
import { reportApis, TDateRangeReportRequest, TPatientStatisticResponse } from "../../infras";

const transformData = (response: IBaseApiResponse<TPatientStatisticResponse>): TPatientStatisticResponse => {
    return response.Data;
};

export const useQueryGetPatientStatisticReport = ({
    params,
    enabled,
}: {
    params: TDateRangeReportRequest;
    enabled: boolean;
}) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QueryKey.REPORT.GET_PATIENT_STATISTIC, params],
        queryFn: () => reportApis.getPatientStatisticReport(params),
        enabled,
    });

    const report = React.useMemo(() => {
        if (isError || isLoading || !data) return null;
        return transformData(data);
    }, [isError, isLoading, data]);

    return { data: report, isLoading, isError, refetch };
};
