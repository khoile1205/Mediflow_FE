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
import { PHONE_NUMBER_PATTERN } from "~/components/form/validation/pattern";
import { PreVaccination } from "./pre-vaccination";
import { TestIndication } from "./test_indication";
import { UnpaidCosts } from "./unpaid_costs";
import { VaccinationIndication } from "./vaccination_indication";
import i18n from "~/configs/i18n";
import { useTranslation } from "react-i18next";

type TabType = "pre_vaccination" | "vaccination_indication" | "examination_indication" | "unpaid_costs";

const ReceptionVaccination: React.FC = () => {
    const { t } = useTranslation();
    const [tab, setTab] = React.useState<TabType>("pre_vaccination");
    const [isNewPatient, setIsNewPatient] = React.useState<boolean>(false);

    const form = useForm();

    const handleCancel = () => {
        form.reset();
        setIsNewPatient(false);
    };

    const handleReset = () => {
        form.reset();
    };

    const onSavePatient = () => {
        console.log("Patient saved:", form.getValues());
    };

    const isDisabledInput = React.useMemo(() => {
        return !isNewPatient;
    }, [isNewPatient]);

    return (
        <DynamicForm form={form}>
            <Stack spacing={1} direction="row" width="100%" className="px-4 py-5">
                <ActionButton
                    label={t(i18n.translationKey.addNew)}
                    startIcon={<AddCircle />}
                    onClick={() => {
                        setIsNewPatient(true);
                    }}
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
                {/* <ActionButton label="Nhập kết quả thử" disabled={!isNewPatient} /> */}
                <ActionButton label={t(i18n.translationKey.deletePaymentOrder)} disabled={!isNewPatient} />
            </Stack>

            <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-2 border px-2 pt-4">
                <Grid container spacing={1}>
                    <Grid size={12}>
                        <Grid container spacing={1}>
                            <Grid size={3}>
                                <FormItem
                                    name="patientId"
                                    render="text-input"
                                    placeholder={t(i18n.translationKey.medicalCode)}
                                    label={t(i18n.translationKey.medicalCode)}
                                    required
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    name="fullName"
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
                                        { label: t(i18n.translationKey.male), value: "male" },
                                        { label: t(i18n.translationKey.female), value: "female" },
                                    ]}
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    name="dateOfBirth"
                                    render="date-picker"
                                    placeholder={t(i18n.translationKey.dateOfBirth)}
                                    label={t(i18n.translationKey.dateOfBirth)}
                                    required
                                    defaultValue={new Date()}
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={1}>
                            <Grid size={9}>
                                <FormItem
                                    name="address"
                                    render="text-input"
                                    placeholder={t(i18n.translationKey.address)}
                                    label={t(i18n.translationKey.address)}
                                    required
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <Box className="flex items-center justify-center">
                                    <FormItem
                                        name="isForeigned"
                                        render="switch"
                                        label={t(i18n.translationKey.foreignPatient)}
                                        defaultValue={true}
                                        disabled={isDisabledInput}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={1}>
                            <Grid size={3}>
                                <ProvinceFormItem size="small" disabled={isDisabledInput} />
                            </Grid>
                            <Grid size={3}>
                                <DistrictFormItem size="small" disabled={isDisabledInput} />
                            </Grid>
                            <Grid size={3}>
                                <WardFormItem size="small" disabled={isDisabledInput} />
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
                        </Grid>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={1}>
                            <Grid size={3}>
                                <FormItem
                                    render="date-time-picker"
                                    name="receptionTime"
                                    placeholder={t(i18n.translationKey.receptionTime)}
                                    label={t(i18n.translationKey.receptionTime)}
                                    required
                                    defaultValue={new Date()}
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    render="select"
                                    placeholder={t(i18n.translationKey.patientType)}
                                    label={t(i18n.translationKey.patientType)}
                                    name="service"
                                    size="small"
                                    options={[{ label: "", value: "" }]}
                                    required
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormItem
                                    render="switch"
                                    name="isPregnant"
                                    label={t(i18n.translationKey.pregnant)}
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

            {tab === "pre_vaccination" && <PreVaccination disabled={isDisabledInput} />}
            {tab === "vaccination_indication" && <VaccinationIndication />}
            {tab === "examination_indication" && <TestIndication />}
            {tab === "unpaid_costs" && <UnpaidCosts />}
        </DynamicForm>
    );
};

export default ReceptionVaccination;
