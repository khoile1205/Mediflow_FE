import { Box, Grid, InputAdornment, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";

interface PreVaccinationProps {
    disabled?: boolean;
}

export const PreVaccination: React.FC<PreVaccinationProps> = ({ disabled }) => {
    const { t } = useTranslation();

    return (
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
                                required
                                name="parentName"
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={12 / 5}>
                            <FormItem
                                render="text-input"
                                label={t(i18n.translationKey.phoneNumber)}
                                required
                                name="parentPhoneNumber"
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={12 / 5}>
                            <FormItem
                                render="input-number"
                                label={t(i18n.translationKey.weight)}
                                required
                                name="kidWeight"
                                disabled={disabled}
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
                                name="kidTemperature"
                                disabled={disabled}
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
                                    name="systolicBloodPressure"
                                    disabled={disabled}
                                />
                                <Typography>/</Typography>
                                <FormItem
                                    render="input-number"
                                    label={t(i18n.translationKey.bloodPressure)}
                                    name="diastolicBloodPressure"
                                    disabled={disabled}
                                />
                                <Typography>{t(i18n.translationKey.unitMmhg)}</Typography>
                            </Stack>
                        </Grid>
                        <Grid size={12}>
                            <Grid container spacing={2}>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="severeReactionPreviousVaccination"
                                        label={t(i18n.translationKey.severeReactionPreviousVaccination)}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="acuteOrChronicDisease"
                                        label={t(i18n.translationKey.acuteOrChronicDisease)}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="recentImmunosuppressiveTreatment"
                                        label={t(i18n.translationKey.recentImmunosuppressiveTreatment)}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="abnormalTemperatureOrVitals"
                                        label={t(i18n.translationKey.abnormalTemperatureOrVitals)}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="abnormalHeartSound"
                                        label={t(i18n.translationKey.abnormalHeartSound)}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="heartValveAbnormality"
                                        label={t(i18n.translationKey.heartValveAbnormality)}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="abnormalDisorder"
                                        label={t(i18n.translationKey.abnormalDisorder)}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="weightUnder2000g"
                                        label={t(i18n.translationKey.weightUnder2000g)}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="otherContraindications"
                                        label={t(i18n.translationKey.otherContraindications)}
                                        disabled={disabled}
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
                                name="eligibleForVaccination"
                                label={t(i18n.translationKey.eligibleForVaccination)}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormItem
                                render="checkbox"
                                name="contraindicatedForVaccination"
                                label={t(i18n.translationKey.contraindicatedForVaccination)}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormItem
                                render="checkbox"
                                name="postponeVaccination"
                                label={t(i18n.translationKey.postponeVaccination)}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormItem
                                render="checkbox"
                                name="referToHospital"
                                label={t(i18n.translationKey.referToHospital)}
                                disabled={disabled}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Stack>
    );
};
