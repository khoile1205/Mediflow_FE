import { useForm } from "~/components/form/hooks/use-form";
import { VaccinationHistoryFormValues } from "../types";

export const useVaccinationHistoryForm = () => {
    const vaccinationHistoryForm = useForm<VaccinationHistoryFormValues>({
        defaultValues: {
            patientCode: "",
            patientVaccinationCode: "",
            patientName: "",
            gender: "",
            phoneNumber: "",
            addressDetail: "",
            ward: "",
            district: "",
            province: "",
            vaccinationHistoryItems: [],
        },
    });

    return vaccinationHistoryForm;
};
