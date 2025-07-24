import { useForm } from "~/components/form/hooks/use-form";
import { ExaminationFormValue } from "./../types";
import { SampleQuality, SampleType } from "~/entities";

export const useExaminationForm = () => {
    const examinationForm = useForm<ExaminationFormValue>({
        defaultValues: {
            examinationId: null,
            patientId: null,
            diagnose: "",
            returnResultsAfter: "30",
            returnTime: null,
            performTechnicianId: null,
            sampleType: SampleType.BLOOD,
            sampleQuality: SampleQuality.HIGH,
            doctorId: null,
            conclusion: "",
            note: "",
            serviceTestParameters: [],
        },
    });

    return examinationForm;
};
