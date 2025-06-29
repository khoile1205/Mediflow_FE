import { useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { receptionApis } from "../../infras";
import { VaccinationPreScreeningRequest } from "../../infras/types";

export const useMutationUpdateVaccinationPrescreening = () => {
    // const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            vaccinationPrescreeningId,
            data,
        }: {
            vaccinationPrescreeningId: number;
            data: VaccinationPreScreeningRequest;
        }) => {
            const response = await receptionApis.updateVaccinationPrescreening(vaccinationPrescreeningId, data);
            return response.Data;
        },
        onSuccess: () => {
            showToast.success(i18n.t(i18n.t(i18n.translationKey.updateVaccinationPrescreeningSuccessfully)));
        },
    });
};
