import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";
import { postVaccinationApis } from "../../infras/post-vaccination.api";
import { QueryKey } from "~/constants/query-key";
import { UpdatePostVaccinationRequest } from "../../infras/types";

export const useMutationUpdatePostVaccinationResult = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.POST_VACCINATION.UPDATE_RESULT],
        mutationFn: async ({ receptionId, data }: { receptionId: number; data: UpdatePostVaccinationRequest }) => {
            return await postVaccinationApis.updatePostVaccinationResult(receptionId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.POST_VACCINATION.GET_PATIENT_LIST],
            });
            showToast.success(i18n.t(i18n.translationKey.updatePostVaccinationResultSuccessfully));
        },
    });
};
