import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras";

export const useMutationDeleteMedicinePrice = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.DELETE_MEDICINE_PRICE],
        mutationFn: (id: number) => inventoryApis.deleteMedicinePrice(id),
    });
};
