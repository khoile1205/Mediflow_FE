import { useMutation } from "@tanstack/react-query";
import { hospitalServiceApis } from "../../infras";

export const useMutationDeleteHospitalServiceGroup = () => {
    return useMutation({
        mutationFn: (id: number) => hospitalServiceApis.deleteHospitalServiceGroup(id),
    });
};
