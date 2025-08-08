import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras";

export const useMutationUpdateInventoryLimitStock = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.UPDATE_INVENTORY_LIMIT_STOCK],
        mutationFn: (data: { id: number; medicineId: number; minimalStockThreshold: number }) =>
            inventoryApis.updateInventoryLimitStock(data),
    });
};
