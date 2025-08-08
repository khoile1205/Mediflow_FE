import { useMutation } from "@tanstack/react-query";
import { deleteMedicine } from "../../infras/inventory.api";

export const useMutationDeleteMedicine = () => {
    return useMutation({
        mutationFn: deleteMedicine,
    });
};
