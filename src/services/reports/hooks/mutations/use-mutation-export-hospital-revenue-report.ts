import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { reportApis, TDateRangeReportRequest } from "../../infras";

export const useMutationExportHospitalRevenueReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.REPORT.EXPORT_HOSPITAL_REVENUE],
        mutationFn: async (params: TDateRangeReportRequest) => {
            const response = await reportApis.exportHospitalRevenueReport(params);
            return response;
        },
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.REPORT.GET_HOSPITAL_REVENUE, variables],
            });

            return response;
        },
    });
};
