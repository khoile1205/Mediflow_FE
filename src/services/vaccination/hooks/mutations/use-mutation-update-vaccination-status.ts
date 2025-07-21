import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { UpdateVaccinationStatusRequest, vaccinationApis } from "../../infras";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";

export const useMutationUpdateVaccinationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.VACCINATION.UPDATE_VACCINATION_STATUS],
        mutationFn: async ({ receptionId, data }: { receptionId: number; data: UpdateVaccinationStatusRequest }) => {
            return await vaccinationApis.updateVaccinationStatus(receptionId, {
                receptionVaccinationId: data.receptionVaccinationId,
                status: data.status,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID],
            });
            showToast.success(i18n.t(i18n.translationKey.updateVaccinationStatusSuccessfully));
        },
    });
};
