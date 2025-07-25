import { useMutation } from "@tanstack/react-query";
import { updateMedicine } from "../../infras/inventory.api";
import { UpdateMedicineDto } from "../../infras/types";

export const useMutationUpdateMedicine = () => {
    return useMutation({
        mutationFn: (data: UpdateMedicineDto) => updateMedicine(data),
    });
};
