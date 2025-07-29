import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras";
import { UpdateMedicinePriceRequest } from "../../infras/types";

export const useMutationUpdateMedicinePrice = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.UPDATE_MEDICINE_PRICE],
        mutationFn: (data: UpdateMedicinePriceRequest) => inventoryApis.updateMedicinePrice(data),
    });
};
