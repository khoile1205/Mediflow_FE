import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { CreateMedicinePriceRequest, inventoryApis } from "../../infras";

export const useMutationCreateMedicinePrice = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.CREATE_MEDICINE_PRICE],
        mutationFn: (data: CreateMedicinePriceRequest) => inventoryApis.createMedicinePrice(data),
    });
};
