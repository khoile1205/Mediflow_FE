import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { CreateReceiptPaymentRequest, hospitalFeeApis } from "../../infras";

export function useMutationCreateQRPayment() {
    return useMutation({
        mutationKey: [QueryKey.HOSPITAL_FEE.CREATE_QR_PAYMENT],
        mutationFn: async ({ patientId, payload }: { patientId: number; payload: CreateReceiptPaymentRequest }) => {
            const response = await hospitalFeeApis.createQRPayment(patientId, payload);
            return response.Data;
        },
        onSuccess: (response) => {
            return response;
        },
    });
}
