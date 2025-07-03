import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { receptionApis } from "../../infras";
import { QueryKey } from "~/constants/query-key";

export const useMutationDeleteVaccinationReception = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ receptionId, listServiceIds }: { receptionId: number; listServiceIds: number[] }) => {
            const response = await receptionApis.deleteVaccinationReceptionById(receptionId, listServiceIds);
            return response.Data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_VACCINATION_RECEPTION_BY_RECEPTION_ID, variables.receptionId],
            });
            showToast.success(i18n.t(i18n.translationKey.deleteVaccinationIndicationSuccessfully));
        },
    });
};
