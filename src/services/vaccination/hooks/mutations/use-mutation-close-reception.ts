import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { ClosingReceptionRequest, vaccinationApis } from "../../infras";

export const useMutationCloseReception = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.VACCINATION.CLOSING_RECEPTION],
        mutationFn: async (data: ClosingReceptionRequest) => {
            return await vaccinationApis.closingReception(data.receptionId, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_WAITING_PATIENT_VACCINATION_LIST],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_NEAREST_EXPIRY_MEDICINE_BATCH],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID, variables.receptionId],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_AVAILABLE_PATIENT_RECEPTIONS, variables.receptionId],
            });

            showToast.success(i18n.t(i18n.translationKey.confirmClosingReceptionSuccessfully));
        },
    });
};
