import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { MedicineBatchesSearchParam, MedicineBatchForStatisticDto, ApiPaginationResponse } from "../../infras/types";
import { inventoryApis } from "../../infras";

export const useQueryGetMedicineBatchesByMedicineId = (params: MedicineBatchesSearchParam, isEnabled = true) => {
    return useQuery<ApiPaginationResponse<MedicineBatchForStatisticDto>>({
        queryKey: [QueryKey.INVENTORY.GET_MEDICINE_BATCHES_BY_MEDICINE_ID_WITH_PAGINATION, params],
        queryFn: async () => {
            const res = await inventoryApis.medicineQuantityStatistics.getMedicineBatchesByMedicineId(params);
            return res.Data as unknown as ApiPaginationResponse<MedicineBatchForStatisticDto>;
        },
        enabled: isEnabled && !!params.medicineId,
        placeholderData: (prev) => prev,
    });
};
