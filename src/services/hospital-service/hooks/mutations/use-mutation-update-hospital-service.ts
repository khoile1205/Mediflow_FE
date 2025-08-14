import { useMutation } from "@tanstack/react-query";
import { hospitalServiceApis } from "../../infras";
import { UpdateHospitalServiceRequest } from "../../infras/types";

export const useMutationUpdateHospitalService = () => {
    return useMutation({
        mutationFn: (data: UpdateHospitalServiceRequest) => hospitalServiceApis.updateHospitalService(data),
    });
};
