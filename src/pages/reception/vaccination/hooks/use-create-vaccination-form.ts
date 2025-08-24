import { Gender } from "~/constants/enums";
import {
    PatientReceptionFormValue,
    TestExaminationIndicationFormValue,
    VaccinationPrescreeningFormValue,
} from "../types";
import { VaccinationIndicateReceptionFormValues } from "../vaccination_indication/types";
import { useForm } from "~/components/form/hooks/use-form";

export const useCreateVaccinationForm = () => {
    // Form setup
    const patientReceptionForm = useForm<PatientReceptionFormValue>({
        defaultValues: {
            code: "",
            name: "",
            gender: Gender.MALE,
            dob: new Date(),
            phoneNumber: "",
            identityCard: "",
            addressDetail: "",
            email: "",
            province: "",
            district: "",
            ward: "",
            isPregnant: false,
            isForeigner: false,
            patientId: null,
            receptionDate: new Date(),
            serviceTypeId: null,
        },
    });

    const vaccinationPrescreeningForm = useForm<VaccinationPrescreeningFormValue>({
        defaultValues: {
            parentFullName: "",
            parentPhoneNumber: "",
            weightKg: 0,
            bodyTemperatureC: 0,
            bloodPressureSystolic: 0,
            bloodPressureDiastolic: 0,
            hasSevereFeverAfterPreviousVaccination: false,
            hasAcuteOrChronicDisease: false,
            isOnOrRecentlyEndedCorticosteroids: false,
            hasAbnormalTemperatureOrVitals: false,
            hasAbnormalHeartSound: false,
            hasHeartValveDisorder: false,
            hasNeurologicalAbnormalities: false,
            isUnderweightBelow2000g: false,
            hasOtherContraindications: false,
            isEligibleForVaccination: false,
            isContraindicatedForVaccination: false,
            isVaccinationDeferred: false,
            isReferredToHospital: false,
        },
    });

    const vaccinationIndicationForm = useForm<VaccinationIndicateReceptionFormValues>({
        defaultValues: {
            vaccineId: null,
            quantity: 1,
            vaccineName: null,
            appointmentDate: null,
            scheduledDate: null,
            note: "",
            isReadyToUse: false,
        },
    });

    const testExaminationIndicationForm = useForm<TestExaminationIndicationFormValue>({
        defaultValues: {
            serviceId: null,
            services: [],
            groupId: 0,
            defaultQuantity: 1,
        },
    });

    return {
        patientReceptionForm,
        vaccinationPrescreeningForm,
        vaccinationIndicationForm,
        testExaminationIndicationForm,
    };
};
