import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { CreateReceiptPaymentRequest, hospitalFeeApis } from "../../infras";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";

export function useMutationCreateReceiptPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.HOSPITAL_FEE.CREATE_PAYMENT],
        mutationFn: async ({ patientId, payload }: { patientId: number; payload: CreateReceiptPaymentRequest }) => {
            const response = await hospitalFeeApis.createReceiptPayment(patientId, payload);
            return response.Data;
        },
        onSuccess: (invoiceNumber: string) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.HOSPITAL_FEE.GET_PATIENT_PAYMENT_LIST],
            });

            showToast.success(i18n.t(i18n.translationKey.createReceiptPaymentSuccessfully));

            return invoiceNumber;
        },
    });
}
