import { useMutation, useQueryClient } from "@tanstack/react-query";
import { receptionApis } from "../../infras";
import { PatientReceptionRequest } from "../../infras/types";
import { getAxiosErrorMessageKey } from "~/libs/axios/helper";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";

export const useMutationPatientReception = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: PatientReceptionRequest) => {
            const response = await receptionApis.createPatientReception(body);
            return response.Data;
        },
        onError: (error) => {
            showToast.error(getAxiosErrorMessageKey(error));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.PATIENT.GET_LIST_PATIENT_WITH_PAGINATION],
            });
            showToast.success(i18n.t(i18n.translationKey.patientReceptionSuccessfully));
        },
    });
};
