import { Box, Button, Grid, InputAdornment, Stack, Typography } from "@mui/material";
import React from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import {
    useMutationCreatePreVaccination,
    useMutationUpdateVaccinationPrescreening,
} from "~/services/reception/hooks/mutations";
import { VaccinationPreScreeningRequest } from "~/services/reception/infras/types";
import { PatientReceptionFormValue, VaccinationPrescreeningFormValue } from "../types";
import { useConclusionCheckboxStatus } from "./use-conclusion-checkbox-status";
import { PHONE_NUMBER_PATTERN } from "~/components/form/validation/pattern";
import { under1MonthOptions, over1MonthOptions } from "./vaccination-options";
import { useQueryGetPrevaccinationByReceptionId } from "~/services/reception/hooks/queries";

interface PreVaccinationProps {
    receptionId?: number;
    form: UseFormReturn<VaccinationPrescreeningFormValue>;
    patientDOB?: Date;
}

const ADULT_MONTH_AGE = 18 * 12;

export const PreVaccination: React.FC<PreVaccinationProps> = ({ receptionId, form, patientDOB }) => {
    const { t } = useTranslation();
    const patientReceptionForm = useFormContext<PatientReceptionFormValue>();

    const { mutateAsync: createVaccinationPrescreening } = useMutationCreatePreVaccination();
    const { mutateAsync: updateVaccinationPrescreening } = useMutationUpdateVaccinationPrescreening();

    const { data: prevaccinationData } = useQueryGetPrevaccinationByReceptionId(receptionId);

    const { isEligibleEnabled, isContraindicatedEnabled, isDeferredEnabled } = useConclusionCheckboxStatus(form);

    const onSubmitPreVaccinationForm = async (data: VaccinationPrescreeningFormValue) => {
        const prevaccinationRequest = getPrevaccinationRequest(data);
        if (!form.getValues("id")) {
            handleCreateVaccinationPrescreening(prevaccinationRequest);
            return;
        }
        handleUpdateVaccinationPrescreening(prevaccinationRequest);
    };

    const getPrevaccinationRequest = (data: VaccinationPrescreeningFormValue): VaccinationPreScreeningRequest => {
        return {
            weightKg: Number(data.weightKg),
            bodyTemperatureC: Number(data.bodyTemperatureC),
            bloodPressureSystolic: Number(data.bloodPressureSystolic),
            bloodPressureDiastolic: Number(data.bloodPressureDiastolic),
            receptionId: Number(receptionId),
            parentFullName: data.parentFullName,
            parentPhoneNumber: data.parentPhoneNumber,
            hasSevereFeverAfterPreviousVaccination: data.hasSevereFeverAfterPreviousVaccination ?? false,
            hasAcuteOrChronicDisease: data.hasAcuteOrChronicDisease ?? false,
            isOnOrRecentlyEndedCorticosteroids: data.isOnOrRecentlyEndedCorticosteroids ?? false,
            hasAbnormalTemperatureOrVitals: data.hasAbnormalTemperatureOrVitals ?? false,
            hasAbnormalHeartSound: data.hasAbnormalHeartSound ?? false,
            hasHeartValveDisorder: data.hasHeartValveDisorder ?? false,
            hasNeurologicalAbnormalities: data.hasNeurologicalAbnormalities ?? false,
            isUnderweightBelow2000g: data.isUnderweightBelow2000g ?? false,
            hasOtherContraindications: data.hasOtherContraindications ?? false,
            isEligibleForVaccination: data.isEligibleForVaccination ?? false,
            isContraindicatedForVaccination: data.isContraindicatedForVaccination ?? false,
            isVaccinationDeferred: data.isVaccinationDeferred ?? false,
            isReferredToHospital: data.isReferredToHospital ?? false,
            hasAbnormalCry: data.hasAbnormalCry ?? false,
            hasPaleSkinOrLips: data.hasPaleSkinOrLips ?? false,
            hasPoorFeeding: data.hasPoorFeeding ?? false,
            isPretermBelow34Weeks: data.isPretermBelow34Weeks ?? false,
            hasImmunodeficiencyOrSuspectedHiv: data.hasImmunodeficiencyOrSuspectedHiv ?? false,
        };
    };

    const handleCreateVaccinationPrescreening = async (prevaccinationRequest: VaccinationPreScreeningRequest) => {
        const vaccinationReceptionId = await createVaccinationPrescreening(prevaccinationRequest);
        form.setValue("id", vaccinationReceptionId);
    };

    const handleUpdateVaccinationPrescreening = async (prevaccinationRequest: VaccinationPreScreeningRequest) => {
        await updateVaccinationPrescreening({
            vaccinationPrescreeningId: form.getValues("id"),
            data: prevaccinationRequest,
        });
    };

    const patientMonthAge = React.useMemo(() => {
        if (!patientDOB) return null;
        const MILISECOND_OF_MONTH = 1000 * 60 * 60 * 24 * 30;
        const ageInMilliseconds = Date.now() - patientReceptionForm.watch("dob").getTime();
        const monthAge = Math.floor(ageInMilliseconds / MILISECOND_OF_MONTH);
        return monthAge;
    }, [patientReceptionForm.watch("dob")]);

    const optionsToRender = React.useMemo(() => {
        if (patientMonthAge !== null && patientMonthAge < 1) {
            return under1MonthOptions;
        }
        return over1MonthOptions;
    }, [patientMonthAge]);

    React.useEffect(() => {
        if (receptionId) {
            form.setValue("isEligibleForVaccination", isEligibleEnabled);
            form.setValue("isContraindicatedForVaccination", isContraindicatedEnabled);
            form.setValue("isVaccinationDeferred", isDeferredEnabled);
        }
    }, [isEligibleEnabled, isContraindicatedEnabled, isDeferredEnabled, receptionId]);

    React.useEffect(() => {
        if (prevaccinationData) {
            form.setValue("id", prevaccinationData.id);
            form.setValue("parentFullName", prevaccinationData.parentFullName);
            form.setValue("parentPhoneNumber", prevaccinationData.parentPhoneNumber);
            form.setValue("weightKg", prevaccinationData.weightKg);
            form.setValue("isUnderweightBelow2000g", prevaccinationData.isUnderweightBelow2000g);
            form.setValue("bodyTemperatureC", prevaccinationData.bodyTemperatureC);
            form.setValue("bloodPressureSystolic", prevaccinationData.bloodPressureSystolic);
            form.setValue("bloodPressureDiastolic", prevaccinationData.bloodPressureDiastolic);
            form.setValue(
                "hasSevereFeverAfterPreviousVaccination",
                prevaccinationData.hasSevereFeverAfterPreviousVaccination,
            );
            form.setValue("hasAcuteOrChronicDisease", prevaccinationData.hasAcuteOrChronicDisease);
            form.setValue("isOnOrRecentlyEndedCorticosteroids", prevaccinationData.isOnOrRecentlyEndedCorticosteroids);
            form.setValue("hasAbnormalTemperatureOrVitals", prevaccinationData.hasAbnormalTemperatureOrVitals);
            form.setValue("hasAbnormalHeartSound", prevaccinationData.hasAbnormalHeartSound);
            form.setValue("hasHeartValveDisorder", prevaccinationData.hasHeartValveDisorder);
            form.setValue("hasNeurologicalAbnormalities", prevaccinationData.hasNeurologicalAbnormalities);
            form.setValue("hasOtherContraindications", prevaccinationData.hasOtherContraindications);
        }
    }, [prevaccinationData]);

    return (
        <DynamicForm form={form}>
            <Stack className="pt-3" spacing={2} direction="column">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg">
                        {patientMonthAge !== null && patientMonthAge < 1
                            ? t(i18n.translationKey.screeningForChildrenUnder1Month)
                            : t(i18n.translationKey.screeningForChildrenOver1Month)}
                    </Typography>
                    <Box
                        sx={{
                            borderColor: "primary.main",
                            borderRadius: 2,
                            "& .MuiFormHelperText-root": {
                                minHeight: 24,
                                maxHeight: 24,
                                lineHeight: "18px",
                                whiteSpace: "normal",
                                overflow: "visible",
                                textOverflow: "clip",
                                margin: 0,
                            },
                            "& .MuiFormLabel-root": {
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                            },
                        }}
                        className="mt-2 border p-5"
                    >
                        <Grid container spacing={2.5}>
                            <Grid size={12 / 5}>
                                <FormItem
                                    render="text-input"
                                    label={t(i18n.translationKey.parentName)}
                                    name="parentFullName"
                                    required={!(patientMonthAge >= ADULT_MONTH_AGE)}
                                    disabled={!receptionId}
                                />
                            </Grid>
                            <Grid size={12 / 5}>
                                <FormItem
                                    render="text-input"
                                    label={t(i18n.translationKey.parentPhoneNumber)}
                                    name="parentPhoneNumber"
                                    required={!(patientMonthAge >= ADULT_MONTH_AGE)}
                                    disabled={!receptionId}
                                    pattern={PHONE_NUMBER_PATTERN}
                                />
                            </Grid>
                            <Grid size={12 / 5}>
                                <FormItem
                                    render="input-number"
                                    label={t(i18n.translationKey.weight)}
                                    required
                                    name="weightKg"
                                    minNumber={1}
                                    maxNumber={form.watch("isUnderweightBelow2000g") ? 2 : undefined}
                                    disabled={!receptionId}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {t(i18n.translationKey.unitKg)}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={12 / 5}>
                                <FormItem
                                    render="input-number"
                                    label={t(i18n.translationKey.temperature)}
                                    required
                                    name="bodyTemperatureC"
                                    minNumber={1}
                                    disabled={!receptionId}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {t(i18n.translationKey.unitCelsius)}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={12 / 5}>
                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid size={6}>
                                        <FormItem
                                            render="input-number"
                                            label={t(i18n.translationKey.bloodPressure)}
                                            name="bloodPressureSystolic"
                                            required
                                            minNumber={1}
                                            disabled={!receptionId}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <InputAdornment position="end">/</InputAdornment>,
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <FormItem
                                            render="input-number"
                                            label={t(i18n.translationKey.bloodPressure)}
                                            name="bloodPressureDiastolic"
                                            required
                                            minNumber={1}
                                            disabled={!receptionId}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {t(i18n.translationKey.unitMmhg)}
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* <Grid size={12}>
                                <Grid container spacing={2}>
                                    {patientMonthAge !== null && patientMonthAge < 1 ? (
                                        <>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAcuteOrChronicDisease"
                                                    label={t(i18n.translationKey.acuteOrChronicDisease)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAbnormalTemperatureOrVitals"
                                                    label={t(i18n.translationKey.abnormalTemperatureOrVitals)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="isUnderweightBelow2000g"
                                                    label={t(i18n.translationKey.weightUnder2000g)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasNeurologicalAbnormalities"
                                                    label={t(i18n.translationKey.abnormalCry)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasHeartValveDisorder"
                                                    label={t(i18n.translationKey.abnormalSkinColor)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAbnormalHeartSound"
                                                    label={t(i18n.translationKey.poorFeeding)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="isOnOrRecentlyEndedCorticosteroids"
                                                    label={t(i18n.translationKey.gestationalAgeUnder34Weeks)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasSevereFeverAfterPreviousVaccination"
                                                    label={t(i18n.translationKey.severeImmunodeficiency)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasSevereFeverAfterPreviousVaccination"
                                                    label={t(i18n.translationKey.severeReactionPreviousVaccination)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAcuteOrChronicDisease"
                                                    label={t(i18n.translationKey.acuteOrChronicDisease)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="isOnOrRecentlyEndedCorticosteroids"
                                                    label={t(i18n.translationKey.recentImmunosuppressiveTreatment)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAbnormalTemperatureOrVitals"
                                                    label={t(i18n.translationKey.abnormalTemperatureOrVitals)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasSevereFeverAfterPreviousVaccination"
                                                    label={t(i18n.translationKey.severeImmunodeficiency)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAbnormalHeartSound"
                                                    label={t(i18n.translationKey.abnormalHeartSound)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasHeartValveDisorder"
                                                    label={t(i18n.translationKey.abnormalBreathing)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasNeurologicalAbnormalities"
                                                    label={t(i18n.translationKey.abnormalConsciousness)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid size={4}>
                                        <FormItem
                                            render="checkbox"
                                            name="hasOtherContraindications"
                                            label={t(i18n.translationKey.otherContraindications)}
                                            disabled={!receptionId}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid> */}
                            {/* <Grid size={12}>
                                <Grid container spacing={2}>
                                    {patientMonthAge !== null && patientMonthAge < 1 ? (
                                        <>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAcuteOrChronicDisease"
                                                    label={t(i18n.translationKey.acuteOrChronicDisease)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAbnormalTemperatureOrVitals"
                                                    label={t(i18n.translationKey.abnormalTemperatureOrVitals)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="isUnderweightBelow2000g"
                                                    label={t(i18n.translationKey.weightUnder2000g)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasNeurologicalAbnormalities"
                                                    label={t(i18n.translationKey.abnormalCry)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasHeartValveDisorder"
                                                    label={t(i18n.translationKey.abnormalSkinColor)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAbnormalHeartSound"
                                                    label={t(i18n.translationKey.poorFeeding)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="isOnOrRecentlyEndedCorticosteroids"
                                                    label={t(i18n.translationKey.gestationalAgeUnder34Weeks)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasSevereFeverAfterPreviousVaccination"
                                                    label={t(i18n.translationKey.severeImmunodeficiency)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasOtherContraindications"
                                                    label={t(i18n.translationKey.otherContraindications)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasSevereFeverAfterPreviousVaccination"
                                                    label={t(i18n.translationKey.severeReactionPreviousVaccination)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAcuteOrChronicDisease"
                                                    label={t(i18n.translationKey.acuteOrChronicDisease)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="isOnOrRecentlyEndedCorticosteroids"
                                                    label={t(i18n.translationKey.recentImmunosuppressiveTreatment)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAbnormalTemperatureOrVitals"
                                                    label={t(i18n.translationKey.abnormalTemperatureOrVitals)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasSevereImmunodeficiency"
                                                    label={t(i18n.translationKey.severeImmunodeficiency)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasAbnormalHeartSound"
                                                    label={t(i18n.translationKey.abnormalHeartSound)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasHeartValveDisorder"
                                                    label={t(i18n.translationKey.abnormalBreathing)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasNeurologicalAbnormalities"
                                                    label={t(i18n.translationKey.abnormalConsciousness)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="checkbox"
                                                    name="hasOtherContraindications"
                                                    label={t(i18n.translationKey.otherContraindications)}
                                                    disabled={!receptionId}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Grid> */}
                            <Grid size={12}>
                                <Grid container spacing={2}>
                                    {optionsToRender.map((opt) => (
                                        <Grid key={opt.name} size={4}>
                                            <FormItem
                                                render="checkbox"
                                                name={opt.name}
                                                label={t(opt.labelKey)}
                                                disabled={!receptionId}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg">
                        {t(i18n.translationKey.conclusion)}
                    </Typography>
                    <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-2 border p-5">
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <FormItem
                                    render="checkbox"
                                    name="isEligibleForVaccination"
                                    label={t(i18n.translationKey.eligibleForVaccination)}
                                    disabled={!receptionId}
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormItem
                                    render="checkbox"
                                    name="isContraindicatedForVaccination"
                                    label={t(i18n.translationKey.contraindicatedForVaccination)}
                                    disabled={!receptionId}
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormItem
                                    render="checkbox"
                                    name="isVaccinationDeferred"
                                    label={t(i18n.translationKey.postponeVaccination)}
                                    disabled={!receptionId}
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormItem
                                    render="checkbox"
                                    name="isReferredToHospital"
                                    label={t(i18n.translationKey.referToHospital)}
                                    disabled={!receptionId}
                                />
                            </Grid>
                        </Grid>
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button
                                disabled={!receptionId}
                                variant="contained"
                                color="primary"
                                onClick={form.handleSubmit(onSubmitPreVaccinationForm)}
                            >
                                {t(i18n.translationKey.save)}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </DynamicForm>
    );
};
