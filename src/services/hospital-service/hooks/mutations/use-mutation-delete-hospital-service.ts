import { useMutation } from "@tanstack/react-query";
import { hospitalServiceApis } from "../../infras";

export const useMutationDeleteHospitalService = () => {
    return useMutation({
        mutationFn: (id: number) => hospitalServiceApis.deleteHospitalService(id),
    });
};
