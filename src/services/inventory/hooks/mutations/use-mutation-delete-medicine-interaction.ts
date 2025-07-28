import { useMutation } from "@tanstack/react-query";
import { inventoryApis } from "../../infras/inventory.api";
import { QueryKey } from "~/constants/query-key";

export function useMutationDeleteMedicineInteraction() {
    return useMutation({
        mutationFn: (id: number) => inventoryApis.deleteMedicineInteraction(id),
        mutationKey: [QueryKey.INVENTORY.DELETE_MEDICINE_INTERACTION],
    });
}
