import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { receptionApis } from "../../infras";
import { ServiceReceptionRequest } from "../../infras/types";
import { QueryKey } from "~/constants/query-key";

export const useMutationAddServiceReception = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: ServiceReceptionRequest) => {
            return await receptionApis.addServiceReception(body);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_SERVICE_RECEPTION_BY_RECEPTION_ID, variables.receptionId],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.RECEPTION.GET_UNPAID_SERVICES, variables.receptionId],
            });
            showToast.success(i18n.t(i18n.translationKey.createServiceReceptionSuccessfully));
        },
    });
};
