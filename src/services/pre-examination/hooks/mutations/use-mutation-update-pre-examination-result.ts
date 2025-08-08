import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { UpdatePreExaminationRequest } from "../../infras/types";
import { preExaminationApis } from "../../infras/pre-vaccination.api";

export const useMutationUpdatePreExaminationResult = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.PRE_EXAMINATION.UPDATE_TEST_RESULT],
        mutationFn: async ({
            receptionVaccinationId,
            data,
        }: {
            receptionVaccinationId: number;
            data: UpdatePreExaminationRequest;
        }) => {
            return await preExaminationApis.updatePreExaminationResult(receptionVaccinationId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.PRE_EXAMINATION.GET_MEDICINE_LIST] });
        },
    });
};
