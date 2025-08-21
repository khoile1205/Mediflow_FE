import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { reportApis, TDateRangeReportRequest } from "../../infras";

export const useMutationExportMedicineRevenueReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.REPORT.EXPORT_MEDICINE_REVENUE],
        mutationFn: async (params: TDateRangeReportRequest) => {
            return await reportApis.exportMedicineRevenueReport(params);
        },
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.REPORT.GET_MEDICINE_REVENUE, variables],
            });

            return response;
        },
    });
};
