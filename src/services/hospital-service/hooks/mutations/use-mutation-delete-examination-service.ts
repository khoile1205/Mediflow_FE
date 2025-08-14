import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { hospitalServiceApis } from "../../infras";

export const useMutationDeleteExaminationService = () => {
    return useMutation({
        mutationKey: [QueryKey.HOSPITAL_SERVICE.DELETE_EXAMINATION_SERVICE],
        mutationFn: (id: number) => hospitalServiceApis.deleteExaminationService(id),
    });
};
