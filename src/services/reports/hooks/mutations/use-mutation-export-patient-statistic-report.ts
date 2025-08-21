import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { reportApis, TDateRangeReportRequest } from "../../infras";

export const useMutationExportPatientStatisticReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.REPORT.EXPORT_PATIENT_STATISTIC],
        mutationFn: async (params: TDateRangeReportRequest) => {
            const response = await reportApis.exportPatientStatisticReport(params);
            return response;
        },
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.REPORT.GET_PATIENT_STATISTIC, variables],
            });

            return response;
        },
    });
};
