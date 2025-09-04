import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { CreateReceiptPaymentRequest, hospitalFeeApis } from "../../infras";
import { PaymentMethod } from "~/constants/enums";

export function useMutationCreateQRPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.HOSPITAL_FEE.CREATE_QR_PAYMENT],
        mutationFn: async ({ patientId, payload }: { patientId: number; payload: CreateReceiptPaymentRequest }) => {
            const response = await hospitalFeeApis.createQRPayment(patientId, {
                ...payload,
                method: PaymentMethod.TRANSFER,
            });
            return response.Data;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.TRANSACTION_HISTORY.GET_LIST_TRANSACTION_HISTORY] });
            return response;
        },
    });
}
