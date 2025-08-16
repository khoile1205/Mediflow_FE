import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { CreateExaminationServiceRequest } from "../../infras/types";
import { hospitalServiceApis } from "../../infras";

export const useMutationCreateExaminationService = () => {
    return useMutation({
        mutationKey: [QueryKey.HOSPITAL_SERVICE.CREATE_EXAMINATION_SERVICE],
        mutationFn: (data: CreateExaminationServiceRequest) => hospitalServiceApis.createExaminationService(data),
    });
};
