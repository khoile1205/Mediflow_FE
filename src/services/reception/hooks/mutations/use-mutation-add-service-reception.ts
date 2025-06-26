import { useMutation } from "@tanstack/react-query";
import { ServiceReceptionRequest } from "../../infras/types";
import { receptionApis } from "../../infras";
import { showToast } from "~/utils";
import { getAxiosErrorMessageKey } from "~/libs/axios/helper";
import i18n from "~/configs/i18n";

export const useMutationAddServiceReception = () => {
    return useMutation({
        mutationFn: async (body: ServiceReceptionRequest) => {
            return await receptionApis.addServiceReception(body);
        },
        onError: (error) => {
            showToast.error(getAxiosErrorMessageKey(error));
        },
        onSuccess: () => {
            showToast.success(i18n.t(i18n.translationKey.createServiceReceptionSuccessfully));
        },
    });
};
