import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras";

export const useMutationDeleteInventoryLimitStock = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.DELETE_INVENTORY_LIMIT_STOCK],
        mutationFn: (id: number) => inventoryApis.deleteInventoryLimitStock(id),
    });
};
