import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { receptionApis } from "../../infras";
import { VaccinationIndicateReceptionFormValues } from "~/pages/reception/vaccination/vaccination_indication/types";
import { AddVaccinationIndicateReceptionRequest } from "../../infras/types";

export const useMutationAddVaccinationReception = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            receptionId,
            data,
        }: {
            receptionId: number;
            data: VaccinationIndicateReceptionFormValues;
        }) => {
            const body: AddVaccinationIndicateReceptionRequest = {
                receptionId,
                vaccineId: data.vaccineId,
                quantity: data.quantity,
                isReadyToUse: data.isReadyToUse,
                scheduledDate: data.scheduledDate,
                appointmentDate: data.appointmentDate,
                note: data.note,
            };

            return await receptionApis.addVaccinationReception(receptionId, body);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_VACCINATION_RECEPTION_BY_RECEPTION_ID, variables.receptionId],
            });
            showToast.success(i18n.t(i18n.translationKey.createVaccinationIndicationSuccessfully));
        },
    });
};
