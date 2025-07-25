import { useMutation } from "@tanstack/react-query";
import { inventoryApis } from "../../infras/inventory.api";

export const useMutationDeleteMedicineInteraction = () => {
    return useMutation({
        mutationFn: (id: number) => inventoryApis.deleteMedicineInteraction(id),
    });
};
