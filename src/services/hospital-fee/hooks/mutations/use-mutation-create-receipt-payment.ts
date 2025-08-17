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
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_WAITING_PATIENT_VACCINATION_LIST],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.EXAMINATION.GET_PATIENTS_FOR_EXAMINATION],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.EXAMINATION.GET_ALL_EXAMINATION_OF_RECEPTION_BY_RECEPTION_ID],
            });
            showToast.success(i18n.t(i18n.translationKey.createReceiptPaymentSuccessfully));

            return invoiceNumber;
        },
    });
}
