import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { receptionApis } from "../../infras";
import { getAxiosErrorMessageKey } from "~/libs/axios/helper";
import { showToast } from "~/utils";

export function useGeneratePatientCode() {
    return useMutation({
        mutationKey: [QueryKey.RECEPTION.GENERATE_PATIENT_IDENTIFIER],
        mutationFn: async () => {
            const response = await receptionApis.generatePatientIdentifier();
            return response.Data;
        },
        onError: (error) => {
            showToast.error(getAxiosErrorMessageKey(error));
        },
        onSuccess: (patientCode: string) => {
            return patientCode;
        },
    });
}
