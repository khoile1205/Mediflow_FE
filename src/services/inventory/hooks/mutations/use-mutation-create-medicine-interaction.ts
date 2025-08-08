import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras/inventory.api";
import { CreateMedicineInteractionRequest } from "../../infras/types";

export const useMutationCreateMedicineInteraction = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.CREATE_MEDICINE_INTERACTION],
        mutationFn: (data: CreateMedicineInteractionRequest) => inventoryApis.createMedicineInteraction(data),
    });
};
