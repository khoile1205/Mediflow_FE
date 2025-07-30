import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras";

export const useMutationCreateInventoryLimitStock = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.CREATE_INVENTORY_LIMIT_STOCK],
        mutationFn: (data: { medicineId: number; minimalStockThreshold: number }) =>
            inventoryApis.createInventoryLimitStock(data),
    });
};
