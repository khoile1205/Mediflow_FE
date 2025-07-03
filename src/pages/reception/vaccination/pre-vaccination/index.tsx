import { Box, Button, Grid, InputAdornment, Stack, Typography } from "@mui/material";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import {
    useMutationCreatePreVaccination,
    useMutationUpdateVaccinationPrescreening,
} from "~/services/reception/hooks/mutations";
import { VaccinationPreScreeningRequest } from "~/services/reception/infras/types";
import { VaccinationPrescreeningFormValue } from "../types";
import { useConclusionCheckboxStatus } from "./use-conclusion-checkbox-status";

interface PreVaccinationProps {
    receptionId?: number;
    form: UseFormReturn<VaccinationPrescreeningFormValue>;
}

// TODO: research for under 1 month old children pre-screening form
export const PreVaccination: React.FC<PreVaccinationProps> = ({ receptionId, form }) => {
    const { t } = useTranslation();

    const { mutateAsync: createVaccinationPrescreening } = useMutationCreatePreVaccination();
    const { mutateAsync: updateVaccinationPrescreening } = useMutationUpdateVaccinationPrescreening();
    const [vaccinationPrescreeningId, setVaccinationPrescreeningId] = React.useState<number | null>(null);

    const { isEligibleEnabled, isContraindicatedEnabled, isDeferredEnabled } = useConclusionCheckboxStatus(form);

    const onSubmitPreVaccinationForm = async (data: VaccinationPrescreeningFormValue) => {
        const prevaccinationRequest = getPrevaccinationRequest(data);
        if (!vaccinationPrescreeningId) {
            handleCreateVaccinationPrescreening(prevaccinationRequest);
            return;
        }
        handleUpdateVaccinationPrescreening(prevaccinationRequest);
    };

    const getPrevaccinationRequest = (data: VaccinationPrescreeningFormValue): VaccinationPreScreeningRequest => {
        return {
            ...data,
            weightKg: Number(data.weightKg),
            bodyTemperatureC: Number(data.bodyTemperatureC),
            bloodPressureSystolic: Number(data.bloodPressureSystolic),
            bloodPressureDiastolic: Number(data.bloodPressureDiastolic),
            receptionId: Number(receptionId),
        };
    };

    const handleCreateVaccinationPrescreening = async (prevaccinationRequest: VaccinationPreScreeningRequest) => {
        const response = await createVaccinationPrescreening(prevaccinationRequest);
        setVaccinationPrescreeningId(response);
    };

    const handleUpdateVaccinationPrescreening = async (prevaccinationRequest: VaccinationPreScreeningRequest) => {
        await updateVaccinationPrescreening({
            vaccinationPrescreeningId,
            data: prevaccinationRequest,
        });
    };

    React.useEffect(() => {
        if (receptionId) {
            form.setValue("isEligibleForVaccination", isEligibleEnabled);
            form.setValue("isContraindicatedForVaccination", isContraindicatedEnabled);
            form.setValue("isVaccinationDeferred", isDeferredEnabled);
        }
    }, [isEligibleEnabled, isContraindicatedEnabled, isDeferredEnabled, receptionId]);

    return (
        <DynamicForm form={form}>
            <Stack className="pt-3" spacing={2} direction="column">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg">
                        {t(i18n.translationKey.screeningForChildrenOver1Month)}
                    </Typography>
                    <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-2 border p-5">
                        <Grid container spacing={2.5}>
                            <Grid size={12 / 5}>
                                <FormItem
                                    render="text-input"
                                    label={t(i18n.translationKey.parentName)}
                                    name="parentFullName"
                                    disabled={!receptionId}
                                />
                            </Grid>
                            <Grid size={12 / 5}>
                                <FormItem
                                    render="text-input"
                                    label={t(i18n.translationKey.parentPhoneNumber)}
                                    name="parentPhoneNumber"
                                    disabled={!receptionId}
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
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <FormItem
                                        render="input-number"
                                        label={t(i18n.translationKey.bloodPressure)}
                                        name="bloodPressureSystolic"
                                        required
                                        minNumber={1}
                                        disabled={!receptionId}
                                    />
                                    <Typography>/</Typography>
                                    <FormItem
                                        render="input-number"
                                        label={t(i18n.translationKey.bloodPressure)}
                                        name="bloodPressureDiastolic"
                                        required
                                        minNumber={1}
                                        disabled={!receptionId}
                                    />
                                    <Typography>{t(i18n.translationKey.unitMmhg)}</Typography>
                                </Stack>
                            </Grid>
                            <Grid size={12}>
                                <Grid container spacing={2}>
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
                                            name="hasAbnormalHeartSound"
                                            label={t(i18n.translationKey.abnormalHeartSound)}
                                            disabled={!receptionId}
                                        />
                                    </Grid>
                                    <Grid size={4}>
                                        <FormItem
                                            render="checkbox"
                                            name="hasHeartValveDisorder"
                                            label={t(i18n.translationKey.heartValveAbnormality)}
                                            disabled={!receptionId}
                                        />
                                    </Grid>
                                    <Grid size={4}>
                                        <FormItem
                                            render="checkbox"
                                            name="hasNeurologicalAbnormalities"
                                            label={t(i18n.translationKey.abnormalDisorder)}
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
                                            name="hasOtherContraindications"
                                            label={t(i18n.translationKey.otherContraindications)}
                                            disabled={!receptionId}
                                        />
                                    </Grid>
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
                            {/* TODO: change the word  */}
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
