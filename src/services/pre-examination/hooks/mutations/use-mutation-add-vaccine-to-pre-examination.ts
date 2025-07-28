import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { preExaminationApis } from "../../infras/pre-vaccination.api";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";

export const useMutationAddVaccineToPreExamination = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.PRE_EXAMINATION.ADD_VACCINE_TO_PRE_EXAMINATION],
        mutationFn: async ({ receptionId }: { receptionId: number }) => {
            return await preExaminationApis.addVaccineToPreExamination({ receptionId });
        },
        onSuccess: () => {
            showToast.success(i18n.t(i18n.translationKey.addVaccineToPreExaminationSuccessfully));
            queryClient.invalidateQueries({ queryKey: [QueryKey.PRE_EXAMINATION.GET_MEDICINE_LIST] });
        },
    });
};
