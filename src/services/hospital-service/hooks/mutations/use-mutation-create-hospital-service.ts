import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis } from "../../infras";
import { CreateHospitalServiceRequest } from "../../infras/types";

export const useMutationCreateHospitalService = () => {
    return useMutation({
        mutationKey: [QueryKey.HOSPITAL_SERVICE.CREATE_HOSPITAL_SERVICE],
        mutationFn: (data: CreateHospitalServiceRequest) => hospitalServiceApis.createHospitalService(data),
    });
};
