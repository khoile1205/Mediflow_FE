import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { preExaminationApis } from "../../infras/pre-vaccination.api";

export const useMutationAddVaccineToPreExamination = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.PRE_EXAMINATION.ADD_VACCINE_TO_PRE_EXAMINATION],
        mutationFn: async ({ receptionId, data }: { receptionId: number; data: number[] }) => {
            return await preExaminationApis.addVaccineToPreExamination({ receptionId, data });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.PRE_EXAMINATION.GET_MEDICINE_LIST] });
        },
    });
};
