import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { receptionApis } from "../../infras";
import { VaccinationPreScreeningRequest } from "../../infras/types";
import { QueryKey } from "~/constants/query-key";

export const useMutationCreatePreVaccination = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: VaccinationPreScreeningRequest) => {
            const response = await receptionApis.createPrevaccinationReport(data);
            return response.Data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_PRE_VACCINATION_BY_RECEPTION_ID, variables.receptionId],
            });
            showToast.success(i18n.t(i18n.translationKey.createVaccinationPrescreeningSuccessfully));
        },
    });
};
