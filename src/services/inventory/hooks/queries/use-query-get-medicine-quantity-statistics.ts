import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import {
    MedicineQuantityStatisticDto,
    MedicineQuantityStatisticsSearchParam,
    ApiPaginationResponse,
} from "../../infras/types";
import { inventoryApis } from "../../infras";

export const useQueryGetMedicineQuantityStatistics = (
    params: MedicineQuantityStatisticsSearchParam,
    isEnabled = true,
) => {
    return useQuery<ApiPaginationResponse<MedicineQuantityStatisticDto>>({
        queryKey: [QueryKey.INVENTORY.GET_MEDICINE_QUANTITY_STATISTICS_WITH_PAGINATION, params],
        queryFn: async () => {
            const res = await inventoryApis.medicineQuantityStatistics.getList(params);
            return res.Data as unknown as ApiPaginationResponse<MedicineQuantityStatisticDto>;
        },
        enabled: isEnabled,
        placeholderData: (prev) => prev,
    });
};
