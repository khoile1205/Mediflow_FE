import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { UpdateExaminationServiceRequest } from "../../infras/types";
import { hospitalServiceApis } from "../../infras";

export const useMutationUpdateExaminationService = () => {
    return useMutation({
        mutationKey: [QueryKey.HOSPITAL_SERVICE.UPDATE_EXAMINATION_SERVICE],
        mutationFn: ({ id, data }: { id: number; data: UpdateExaminationServiceRequest }) =>
            hospitalServiceApis.updateExaminationService(id, data),
    });
};
