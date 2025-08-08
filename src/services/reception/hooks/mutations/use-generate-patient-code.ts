import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { receptionApis } from "../../infras";

export function useGeneratePatientCode() {
    return useMutation({
        mutationKey: [QueryKey.RECEPTION.GENERATE_PATIENT_IDENTIFIER],
        mutationFn: async () => {
            const response = await receptionApis.generatePatientIdentifier();
            return response.Data;
        },
        onSuccess: (patientCode: string) => {
            return patientCode;
        },
    });
}
