import { useQueryClient, useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { Examination } from "~/entities";
import { showToast } from "~/utils";
import { examinationApis } from "../../infras";

export function useMutationUpsertExaminationResult() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.EXAMINATION.UPSERT_EXAMINATION_RESULT],
        mutationFn: async (payload: Examination[]) => {
            const response = await examinationApis.upsertExaminationResult(payload);
            return response;
        },
        onSuccess: (_response, payload) => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === QueryKey.EXAMINATION.GET_PATIENTS_FOR_EXAMINATION;
                },
            });
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === QueryKey.RECEPTION.GET_SERVICE_RECEPTION_BY_RECEPTION_ID;
                },
            });
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === QueryKey.RECEPTION.GET_UNPAID_SERVICES;
                },
            });
            payload.forEach((examination) => {
                queryClient.invalidateQueries({
                    queryKey: [
                        QueryKey.EXAMINATION.GET_PATIENT_EXAMINATION_DETAIL_BY_EXAMINATION_ID,
                        examination.examinationId,
                    ],
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        QueryKey.EXAMINATION.GET_PATIENT_EXAMINATION_DETAIL_BY_EXAMINATION_ID,
                        examination.examinationId,
                    ],
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        QueryKey.EXAMINATION.GET_SERVICE_TEST_PARAMETERS_OF_EXAMINATION_BY_EXAMINATION_ID,
                        examination.examinationId,
                    ],
                });
            });
            showToast.success(i18n.t(i18n.translationKey.upsertExaminationResultSuccessfully));
        },
    });
}
