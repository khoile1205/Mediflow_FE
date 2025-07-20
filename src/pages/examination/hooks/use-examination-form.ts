import { useForm } from "~/components/form/hooks/use-form";
import { ExaminationFormValue } from "./../types";
import { ResultForm, SampleQuality, SampleType } from "~/entities";
import { Gender } from "~/constants/enums";

export const useExaminationForm = () => {
    const examinationForm = useForm<ExaminationFormValue>({
        defaultValues: {
            patient: {
                id: 0,
                code: "",
                name: "",
                gender: Gender.MALE,
                dob: new Date(),
                phoneNumber: "",
                email: "",
                identityCard: "",
                addressDetail: "",
                province: "",
                district: "",
                ward: "",
                isPregnant: false,
                isForeigner: false,
                isSuspended: false,
                isCancelled: false,
                createdAt: new Date(),
                createdBy: 1,
                lastUpdatedAt: new Date(),
                lastUpdatedBy: 1,
            },
            patientYearOld: 0,
            patientYOB: 0,
            diagnose: "",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: null,
            returnResultsAfter: 30,
            appointmentTimeForResult: new Date(),
            resultForm: ResultForm.ONLINE,
            sampleType: SampleType.BLOOD,
            sampleQuality: SampleQuality.HIGH,
            concludedDoctorId: null,
            receiverId: null,
            conclusion: "",
            note: "",
            isDiagnosed: false,
        },
    });

    return examinationForm;
};
