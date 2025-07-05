import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { receptionApis } from "../../infras";
import { UpdateVaccinationIndicateReceptionRequest } from "../../infras/types";
import { VaccinationIndicateReceptionFormValues } from "~/pages/reception/vaccination/vaccination_indication/types";

export const useMutationUpdateVaccinationReception = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            receptionId,
            data,
        }: {
            receptionId: number;
            data: VaccinationIndicateReceptionFormValues;
        }) => {
            const body: UpdateVaccinationIndicateReceptionRequest = {
                id: data.id,
                quantity: Number(data.quantity),
                appointmentDate: data.appointmentDate,
                scheduledDate: data.scheduledDate,
                note: data.note,
                isReadyToUse: data.isReadyToUse,
            };

            return await receptionApis.updateVaccinationReceptionByReceptionId(receptionId, body);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_VACCINATION_RECEPTION_BY_RECEPTION_ID, variables.receptionId],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_UNPAID_SERVICES, variables.receptionId],
            });
            showToast.success(i18n.t(i18n.translationKey.updateVaccinationIndicationSuccessfully));
        },
    });
};
