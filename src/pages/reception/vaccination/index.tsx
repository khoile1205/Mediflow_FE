import { AddCircle, Clear, Edit, RestartAlt, Save, Search, Undo } from "@mui/icons-material";
import { Box, Grid, Stack } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import DistrictFormItem from "~/components/form/custom/district.form-item";
import ProvinceFormItem from "~/components/form/custom/province.form-item";
import WardFormItem from "~/components/form/custom/ward.form-item";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import { toBaseOption } from "~/components/form/utils";
import { PHONE_NUMBER_PATTERN, VIETNAMESE_ID_CARD_PATTERN } from "~/components/form/validation/pattern";
import { PatientSelectModal } from "~/components/modal/patient-select.modal";
import i18n from "~/configs/i18n";
import { Gender } from "~/constants/enums";
import { Patient } from "~/entities";
import { ServiceGroup } from "~/entities/hospital-service.entity";
import { getAxiosErrorMessageKey } from "~/libs/axios/helper";
import { hospitalServiceService } from "~/services/hospital-service";
import { receptionService } from "~/services/reception";
import { PatientReceptionRequest } from "~/services/reception/types";
import { showToast } from "~/utils";
import { PreVaccination } from "./pre-vaccination";
import { TestIndication } from "./test_indication";
import { PatientReceptionFormValue } from "./types";
import { UnpaidCosts } from "./unpaid_costs";
import { VaccinationIndication } from "./vaccination_indication";

type TabType = "pre_vaccination" | "vaccination_indication" | "examination_indication" | "unpaid_costs";

const ReceptionVaccination: React.FC = () => {
    const { t } = useTranslation();
    const [tab, setTab] = React.useState<TabType>("pre_vaccination");
    const [isRecepting, setIsRecepting] = React.useState<boolean>(false);
    const [receptionId] = React.useState<number | null>(null);
    const [serviceGroup, setServiceGroup] = React.useState<ServiceGroup[]>([]);
    const [isOpenPatientSelectModal, setIsOpenPatientSelectModal] = React.useState<boolean>(false);

    const form = useForm<PatientReceptionFormValue>({
        defaultValues: {
            code: "",
            name: "",
            gender: Gender.MALE,
            dob: new Date(),
            phoneNumber: "",
            identityCard: "",
            addressDetail: "",
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

    const handleAddNewPatient = () => {
        form.reset();
        // TODO: Call API for generating new patient ID
        form.setValue("code", generatePatientCode());
        setIsRecepting(true);
    };

    const generatePatientCode = () => {
        // TODO: Implement patient code generation logic
        return "CDCDN" + new Date().getTime();
    };

    const handleSelectPatient = (patient: Patient) => {
        form.reset();
        form.setValue("patientId", patient.id);
        form.setValue("code", patient.code);
        form.setValue("name", patient.name);
        form.setValue("addressDetail", patient.addressDetail);
        form.setValue("gender", patient.gender);
        form.setValue("dob", patient.dob ? new Date(patient.dob) : null);
        form.setValue("phoneNumber", patient.phoneNumber);
        form.setValue("identityCard", patient.identityCard);
        form.setValue("province", patient.province);
        form.setValue("district", patient.district);
        form.setValue("ward", patient.ward);
        form.setValue("receptionDate", new Date());
        form.setValue("serviceTypeId", null);
        setIsRecepting(true);
    };

    const handleCancel = () => {
        form.reset();
        setIsRecepting(false);
    };

    const handleReset = () => {
        const patientCode = form.getValues("code");

        form.reset();
        form.setValue("code", patientCode);
    };

    const onSavePatient = async () => {
        // TODO: Call API to save patient reception
        try {
            const patientReceptionBody: PatientReceptionRequest = getPatientReceptionBody();
            await receptionService.createPatientReception(patientReceptionBody);
        } catch (error) {
            showToast.error(getAxiosErrorMessageKey(error));
        }
    };

    const getPatientReceptionBody = () => {
        return {
            createPatientCommand: {
                code: form.getValues("code"),
                name: form.getValues("name"),
                gender: form.getValues("gender"),
                dob: form.getValues("dob"),
                phoneNumber: form.getValues("phoneNumber"),
                identityCard: form.getValues("identityCard"),
                // email: "dinhkhoi.le3@gmail.com",
                addressDetail: form.getValues("addressDetail"),
                province: form.getValues("province"),
                district: form.getValues("district"),
                ward: form.getValues("ward"),
                isPregnant: form.getValues("isPregnant"),
                isForeigner: form.getValues("isForeigner"),
            },
            createReceptionDTO: {
                patientId: form.getValues("patientId") ?? 0,
                receptionDate: form.getValues("receptionDate"),
                serviceTypeId: form.getValues("serviceTypeId"),
            },
            patientId: form.getValues("patientId") ?? 0,
        };
    };

    const getServiceGroup = async (searchTerms: string) => {
        try {
            const response = await hospitalServiceService.getAllHospitalServiceGroup({ searchTerms });
            setServiceGroup(response.Data || []);
        } catch (error) {
            showToast.error(getAxiosErrorMessageKey(error));
        }
    };

    const initializeData = async () => {
        await Promise.allSettled([getServiceGroup("")]);
    };

    React.useEffect(() => {
        initializeData();
    }, []);

    React.useEffect(() => {
        if (form.watch("gender") === Gender.MALE) {
            form.setValue("isPregnant", false);
        }
    }, [form.watch("gender")]);

    // TODO: Ask for PO for the age of kid need to prescreening
    const isDisabledPrescreening = React.useMemo(() => {
        const MAX_AGE_FOR_PRESCREENING = 5;
        const dob = form.watch("dob");

        if (!receptionId || !dob) return true;

        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age >= MAX_AGE_FOR_PRESCREENING;
    }, [form.watch("dob"), receptionId]);

    const isEnableProcessSubtask = React.useMemo(() => {
        return isRecepting && receptionId != null;
    }, [isRecepting, receptionId]);

    return (
        <>
            <DynamicForm form={form}>
                <Stack spacing={1} direction="row" width="100%" className="px-4 py-5">
                    <ActionButton
                        label={t(i18n.translationKey.addNew)}
                        startIcon={<AddCircle />}
                        onClick={handleAddNewPatient}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.search)}
                        startIcon={<Search />}
                        onClick={() => {
                            setIsOpenPatientSelectModal(true);
                        }}
                    />
                    {/* <ActionButton label={t(i18n.translationKey.edit)} startIcon={<Edit />} disabled={!isRecepting} /> */}
                    <ActionButton
                        label={t(i18n.translationKey.reception)}
                        startIcon={<Save />}
                        disabled={!isRecepting}
                        onClick={form.handleSubmit(onSavePatient)}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.reset)}
                        startIcon={<RestartAlt />}
                        disabled={!isRecepting}
                        onClick={handleReset}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.cancel)}
                        startIcon={<Undo />}
                        disabled={!isRecepting}
                        onClick={handleCancel}
                    />
                    {/* <ActionButton label={t(i18n.translationKey.deletePaymentOrder)} disabled={!isRecepting} /> */}
                </Stack>

                <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-2 border px-2 pt-4">
                    <Grid container spacing={1}>
                        <Grid size={12}>
                            <Grid container spacing={1}>
                                <Grid size={3}>
                                    <FormItem
                                        name="code"
                                        render="text-input"
                                        placeholder={t(i18n.translationKey.medicalCode)}
                                        label={t(i18n.translationKey.medicalCode)}
                                        required
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                        disabled={!isRecepting}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormItem
                                        name="name"
                                        render="text-input"
                                        placeholder={t(i18n.translationKey.fullName)}
                                        label={t(i18n.translationKey.fullName)}
                                        required
                                        disabled={!isRecepting}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormItem
                                        name="gender"
                                        render="select"
                                        placeholder={t(i18n.translationKey.gender)}
                                        label={t(i18n.translationKey.gender)}
                                        size="small"
                                        required
                                        options={[
                                            { label: t(i18n.translationKey.male), value: Gender.MALE },
                                            { label: t(i18n.translationKey.female), value: Gender.FEMALE },
                                        ]}
                                        disabled={!isRecepting}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormItem
                                        name="identityCard"
                                        render="text-input"
                                        placeholder={`${t(i18n.translationKey.identityCard)}/${t(i18n.translationKey.passport)}`}
                                        label={`${t(i18n.translationKey.identityCard)}/${t(i18n.translationKey.passport)}`}
                                        required
                                        disabled={!isRecepting}
                                        pattern={VIETNAMESE_ID_CARD_PATTERN}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <Grid container spacing={1}>
                                <Grid size={3}>
                                    <FormItem
                                        name="dob"
                                        render="date-picker"
                                        placeholder={t(i18n.translationKey.dateOfBirth)}
                                        label={t(i18n.translationKey.dateOfBirth)}
                                        required
                                        defaultValue={new Date()}
                                        maxDate={new Date()}
                                        disabled={!isRecepting}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormItem
                                        name="phoneNumber"
                                        render="text-input"
                                        placeholder={t(i18n.translationKey.phoneNumber)}
                                        label={t(i18n.translationKey.phoneNumber)}
                                        required
                                        pattern={PHONE_NUMBER_PATTERN}
                                        disabled={!isRecepting}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <Box className="flex items-center justify-center">
                                        <FormItem
                                            name="isForeigner"
                                            render="switch"
                                            label={t(i18n.translationKey.foreignPatient)}
                                            defaultValue={true}
                                            disabled={!isRecepting}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={2}>
                                    <Box className="flex items-center justify-center">
                                        <FormItem
                                            render="switch"
                                            name="isPregnant"
                                            label={t(i18n.translationKey.pregnant)}
                                            disabled={isRecepting || form.watch("gender") === Gender.MALE}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <Grid container spacing={1}>
                                <Grid size={4}>
                                    <ProvinceFormItem name="province" size="small" disabled={!isRecepting} />
                                </Grid>
                                <Grid size={4}>
                                    <DistrictFormItem name="district" size="small" disabled={!isRecepting} />
                                </Grid>
                                <Grid size={4}>
                                    <WardFormItem name="ward" size="small" disabled={!isRecepting} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <FormItem
                                name="addressDetail"
                                render="text-input"
                                placeholder={t(i18n.translationKey.address)}
                                label={t(i18n.translationKey.address)}
                                required
                                disabled={!isRecepting}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Grid container spacing={1}>
                                <Grid size={3}>
                                    <FormItem
                                        render="date-time-picker"
                                        name="receptionDate"
                                        placeholder={t(i18n.translationKey.receptionTime)}
                                        label={t(i18n.translationKey.receptionTime)}
                                        required
                                        defaultValue={new Date()}
                                        disabled={!isRecepting}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormItem
                                        render="autocomplete"
                                        placeholder={t(i18n.translationKey.serviceType)}
                                        label={t(i18n.translationKey.serviceType)}
                                        name="serviceTypeId"
                                        size="small"
                                        options={toBaseOption<ServiceGroup>(serviceGroup, {
                                            label: "groupName",
                                            value: "id",
                                        })}
                                        required
                                        disabled={!isRecepting}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-5 border p-2">
                    <Stack spacing={5} direction="row" width="100%">
                        <ActionButton
                            label={t(i18n.translationKey.preScreening)}
                            startIcon={<AddCircle />}
                            onClick={() => setTab("pre_vaccination")}
                        />
                        <ActionButton
                            label={t(i18n.translationKey.vaccinationIndication)}
                            startIcon={<Edit />}
                            onClick={() => setTab("vaccination_indication")}
                        />
                        <ActionButton
                            label={t(i18n.translationKey.examinationIndication)}
                            startIcon={<Save />}
                            onClick={() => setTab("examination_indication")}
                        />
                        <ActionButton
                            label={t(i18n.translationKey.unpaidCost)}
                            startIcon={<Clear />}
                            onClick={() => setTab("unpaid_costs")}
                        />
                    </Stack>
                </Box>
            </DynamicForm>
            {tab === "pre_vaccination" && <PreVaccination disabled={isDisabledPrescreening} />}
            {tab === "vaccination_indication" && <VaccinationIndication />}
            {tab === "examination_indication" && (
                <TestIndication disabled={!isEnableProcessSubtask} receptionId={receptionId} />
            )}
            {tab === "unpaid_costs" && <UnpaidCosts />}
            <PatientSelectModal
                open={isOpenPatientSelectModal}
                onClose={() => setIsOpenPatientSelectModal(false)}
                onSelect={handleSelectPatient}
            />
        </>
    );
};

export default ReceptionVaccination;
