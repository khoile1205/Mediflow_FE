import { useForm } from "~/components/form/hooks/use-form";
import { PatientFormValue, VaccinationFormValue } from "../types";

export const useCreateVaccinationForm = () => {
    const patientForm = useForm<PatientFormValue>({
        defaultValues: {
            receptionId: null,
            patientCode: "",
            patientName: "",
            dateOfBirth: "",
            gender: null,
            weightKg: 0,
            patientVaccinationCode: "",
        },
    });
    const vaccinationForm = useForm<VaccinationFormValue>({
        defaultValues: {
            receptionVaccinationId: null,
            medicineId: null,
            medicineBatchCode: "",
            medicineExpiryDate: null,
            isInjected: false,
            testingStartTime: null,
            injectionDate: null,
            note: "",
        },
    });

    return { patientForm, vaccinationForm };
};
