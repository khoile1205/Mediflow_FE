import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { RejectVaccinationRequest, vaccinationApis } from "../../infras";

export const useMutationRejectInjectVaccine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.VACCINATION.REJECT_INJECT_VACCINE],
        mutationFn: async (data: RejectVaccinationRequest) => {
            return await vaccinationApis.rejectInject(data.receptionVaccinationId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_WAITING_PATIENT_VACCINATION_LIST],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_NEAREST_EXPIRY_MEDICINE_BATCH],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID],
            });

            showToast.success(i18n.t(i18n.translationKey.confirmRejectInjectedSuccessfully));
        },
    });
};
