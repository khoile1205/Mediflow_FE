import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { vaccinationApis } from "../../infras";

export const useMutationConfirmVaccinationToday = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.VACCINATION.CONFIRM_VACCINATION_TODAY],
        mutationFn: async (receptionId: number) => {
            return await vaccinationApis.confirmVaccinationToday(receptionId);
        },
        onSuccess: (_, receptionId: number) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_WAITING_PATIENT_VACCINATION_LIST],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_NEAREST_EXPIRY_MEDICINE_BATCH],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID, receptionId],
            });

            showToast.success(i18n.t(i18n.translationKey.confirmVaccinationTodaySuccessfully));
        },
    });
};
