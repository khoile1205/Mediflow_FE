import { useMutation } from "@tanstack/react-query";
import { inventoryApis } from "../../infras/inventory.api";
import { UpdateMedicineInteractionRequest } from "../../infras/types";

export const useMutationUpdateMedicineInteraction = () => {
    return useMutation({
        mutationFn: (payload: UpdateMedicineInteractionRequest) => inventoryApis.updateMedicineInteraction(payload),
    });
};
