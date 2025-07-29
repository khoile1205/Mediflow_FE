import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { CreateMedicineRequest } from "../../infras/types";
import { inventoryApis } from "../../infras/inventory.api";

export const useQueryCreateMedicine = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.CREATE_MEDICINE],
        mutationFn: (data: CreateMedicineRequest) => inventoryApis.createMedicine(data),
    });
};
