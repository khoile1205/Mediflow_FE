import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { receptionApis } from "../../infras";
import { VaccinationPreScreeningRequest } from "../../infras/types";
import { QueryKey } from "~/constants/query-key";

export const useMutationUpdateVaccinationPrescreening = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            vaccinationPrescreeningId,
            data,
        }: {
            vaccinationPrescreeningId: number;
            data: VaccinationPreScreeningRequest;
        }) => {
            const response = await receptionApis.updateVaccinationPrescreening(vaccinationPrescreeningId, data);
            return response.Data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_PRE_VACCINATION_BY_RECEPTION_ID],
            });
            showToast.success(i18n.t(i18n.t(i18n.translationKey.updateVaccinationPrescreeningSuccessfully)));
        },
    });
};
