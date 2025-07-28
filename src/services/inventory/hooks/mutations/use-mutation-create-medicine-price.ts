import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras";
import { MedicinePrice } from "../../infras/types";

export const useMutationCreateMedicinePrice = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.CREATE_MEDICINE_PRICE],
        mutationFn: (data: MedicinePrice) => inventoryApis.createMedicinePrice(data),
    });
};
