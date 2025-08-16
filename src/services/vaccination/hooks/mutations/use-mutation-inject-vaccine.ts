import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { VaccinationFormValue } from "~/pages/vaccination/types";
import { showToast } from "~/utils";
import { vaccinationApis } from "../../infras";

export const useMutationInjectVaccine = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [QueryKey.VACCINATION.INJECT_VACCINATION],
        mutationFn: async (data: VaccinationFormValue) => {
            return await vaccinationApis.injectVaccine({
                patientId: data.patientId,
                receptionVaccinationId: data.receptionVaccinationId,
                medicineBatchId: data.medicineBatchId,
                batchNumber: data.medicineBatchNumber,
                medicineId: data.medicineId,
                medicineName: data.medicineName,
                note: data.note || "",
                doctorId: data.doctorId,
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_NEAREST_EXPIRY_MEDICINE_BATCH],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    QueryKey.RECEPTION.GET_VACCINATION_RECEPTION_BY_RECEPTION_ID,
                    variables.receptionVaccinationId,
                ],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.POST_VACCINATION.GET_PATIENT_LIST],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.POST_VACCINATION.GET_MEDICINE_LIST],
            });

            showToast.success(i18n.t(i18n.translationKey.confirmInjectedSuccessfully));
        },
    });
};
