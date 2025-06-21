import { AddCircle, Clear, Edit, Save, Search, Undo } from "@mui/icons-material";
import { Box, Grid, Stack } from "@mui/material";
import React from "react";
import { ActionButton } from "~/components/common/action-button";
import DistrictFormItem from "~/components/form/custom/district.form-item";
import ProvinceFormItem from "~/components/form/custom/province.form-item";
import WardFormItem from "~/components/form/custom/ward.form-item";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import { PHONE_NUMBER_PATTERN, VIETNAMESE_ID_CARD_PATTERN } from "~/components/form/validation/pattern";
import { PreVaccination } from "./pre-vaccination";
import { TestIndication } from "./test_indication";
import { UnpaidCosts } from "./unpaid_costs";
import { VaccinationIndication } from "./vaccination_indication";
import i18n from "~/configs/i18n";
import { useTranslation } from "react-i18next";
import { Gender } from "~/constants/enums";
import { ServiceGroup } from "~/entities/hospital-service.entity";
import { hospitalServiceService } from "~/services/hospital-service";
import { showToast } from "~/utils";
import { getAxiosErrorMessage } from "~/libs/axios/helper";
import { toBaseOption } from "~/components/form/utils";
import { PatientReceptionFormValue } from "./types";
import { PatientReceptionRequest } from "~/services/reception/types";
import { receptionService } from "~/services/reception";

type TabType = "pre_vaccination" | "vaccination_indication" | "examination_indication" | "unpaid_costs";

const ReceptionVaccination: React.FC = () => {
    const { t } = useTranslation();
    const [tab, setTab] = React.useState<TabType>("pre_vaccination");
    const [isNewPatient, setIsNewPatient] = React.useState<boolean>(false);
    const [serviceGroup, setServiceGroup] = React.useState<ServiceGroup[]>([]);
    const [isSelectedPatient, setIsSelectedPatient] = React.useState<boolean>(false);

    const form = useForm<PatientReceptionFormValue>({
        defaultValues: {
            code: "",
            name: "",
            gender: Gender.MALE,
            dob: null,
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
        setIsNewPatient(true);
    };

    const generatePatientCode = () => {
        // TODO: Implement patient code generation logic
        return "PATIENT-" + new Date().getTime();
    };

    const handleCancel = () => {
        form.reset();
        setIsNewPatient(false);
        setIsSelectedPatient(false);
    };

    const handleReset = () => {
        form.reset();
        setIsSelectedPatient(false);
    };

    const onSavePatient = async () => {
        // TODO: Call API to save patient reception
        try {
            const patientReceptionBody: PatientReceptionRequest = getPatientReceptionBody();
            await receptionService.createPatientReception(patientReceptionBody);
        } catch (error) {
            showToast.error(getAxiosErrorMessage(error));
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
                addressDetail: form.getValues("addressDetail"),
                province: form.getValues("province"),
                district: form.getValues("district"),
                ward: form.getValues("ward"),
                isPregnant: form.getValues("isPregnant"),
                isForeigner: form.getValues("isForeigner"),
            },
            createReceptionDTO: {
                patientId: form.getValues("patientId"),
                receptionDate: form.getValues("receptionDate"),
                serviceTypeId: form.getValues("serviceTypeId"),
            },
            patientId: form.getValues("patientId") || undefined,
        };
    };

    const isDisabledInput = React.useMemo(() => {
        return !isNewPatient;
    }, [isNewPatient]);

    const handleServiceGroupInputChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
        if (value.length > 0) {
            getServiceGroup(value);
        }
    };

    const getServiceGroup = async (searchTerms: string) => {
        try {
            const response = await hospitalServiceService.getAllHospitalServiceGroup({ searchTerms });
            setServiceGroup(response.Data || []);
        } catch (error) {
            showToast.error(getAxiosErrorMessage(error));
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

        if (!isSelectedPatient || !dob) return true;

        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age >= MAX_AGE_FOR_PRESCREENING;
    }, [form.watch("dob"), isSelectedPatient]);

    return (
        <>
            <DynamicForm form={form}>
                <Stack spacing={1} direction="row" width="100%" className="px-4 py-5">
                    <ActionButton
                        label={t(i18n.translationKey.addNew)}
                        startIcon={<AddCircle />}
                        onClick={handleAddNewPatient}
                    />
                    <ActionButton label={t(i18n.translationKey.search)} startIcon={<Search />} />
                    <ActionButton label={t(i18n.translationKey.edit)} startIcon={<Edit />} disabled={!isNewPatient} />
                    <ActionButton
                        label={t(i18n.translationKey.save)}
                        startIcon={<Save />}
                        disabled={!isNewPatient}
                        onClick={form.handleSubmit(onSavePatient)}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.delete)}
                        startIcon={<Clear />}
                        disabled={!isNewPatient}
                        onClick={handleReset}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.cancel)}
                        startIcon={<Undo />}
                        disabled={!isNewPatient}
                        onClick={handleCancel}
                    />
                    <ActionButton label={t(i18n.translationKey.deletePaymentOrder)} disabled={!isNewPatient} />
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
                                        disabled={isDisabledInput}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormItem
                                        name="name"
                                        render="text-input"
                                        placeholder={t(i18n.translationKey.fullName)}
                                        label={t(i18n.translationKey.fullName)}
                                        required
                                        disabled={isDisabledInput}
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
                                        disabled={isDisabledInput}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormItem
                                        name="identityCard"
                                        render="text-input"
                                        placeholder={`${t(i18n.translationKey.identityCard)}/${t(i18n.translationKey.passport)}`}
                                        label={`${t(i18n.translationKey.identityCard)}/${t(i18n.translationKey.passport)}`}
                                        required
                                        disabled={isDisabledInput}
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
                                        disabled={isDisabledInput}
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
                                        disabled={isDisabledInput}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <Box className="flex items-center justify-center">
                                        <FormItem
                                            name="isForeigner"
                                            render="switch"
                                            label={t(i18n.translationKey.foreignPatient)}
                                            defaultValue={true}
                                            disabled={isDisabledInput}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={2}>
                                    <Box className="flex items-center justify-center">
                                        <FormItem
                                            render="switch"
                                            name="isPregnant"
                                            label={t(i18n.translationKey.pregnant)}
                                            disabled={isDisabledInput || form.watch("gender") === Gender.MALE}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <Grid container spacing={1}>
                                <Grid size={4}>
                                    <ProvinceFormItem name="province" size="small" disabled={isDisabledInput} />
                                </Grid>
                                <Grid size={4}>
                                    <DistrictFormItem name="district" size="small" disabled={isDisabledInput} />
                                </Grid>
                                <Grid size={4}>
                                    <WardFormItem name="ward" size="small" disabled={isDisabledInput} />
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
                                disabled={isDisabledInput}
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
                                        disabled={isDisabledInput}
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
                                            label: "GroupName",
                                            value: "Id",
                                        })}
                                        // required
                                        onInputChange={handleServiceGroupInputChange}
                                        disabled={isDisabledInput}
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
            {tab === "examination_indication" && <TestIndication />}
            {tab === "unpaid_costs" && <UnpaidCosts />}
        </>
    );
};

export default ReceptionVaccination;
