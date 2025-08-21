import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { reportApis, TDateRangeReportRequest } from "../../infras";

export const useMutationExportInventoryStatisticReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.REPORT.EXPORT_INVENTORY_STATISTIC],
        mutationFn: async (params: TDateRangeReportRequest) => {
            return await reportApis.exportInventoryStatisticReport(params);
        },
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.REPORT.GET_INVENTORY_STATISTIC, variables],
            });

            return response;
        },
    });
};
