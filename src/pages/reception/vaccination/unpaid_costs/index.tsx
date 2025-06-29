import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import DynamicForm from "~/components/form/dynamic-form";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
// import { useQueryReceptionUnpaidServices } from "~/services/reception/hooks/queries";
import { formatCurrencyVND } from "~/utils/currency";

interface UnpaidCostsProps {
    receptionId?: number;
}

export const UnpaidCosts: React.FC<UnpaidCostsProps> = () => {
    const { t } = useTranslation();
    // const { data: unpaidServices } = useQueryReceptionUnpaidServices(receptionId);

    const consultationFee = React.useMemo(() => {
        return 0;
    }, []);

    const examinationFee = React.useMemo(() => {
        return 0;
    }, []);
    const injectionFee = React.useMemo(() => {
        return 0;
    }, []);
    const vaccineFee = React.useMemo(() => {
        return 0;
    }, []);
    const testFee = React.useMemo(() => {
        return 0;
    }, []);

    const totalUnpaid = React.useMemo(() => {
        return consultationFee + examinationFee + injectionFee + vaccineFee + testFee;
    }, [consultationFee, examinationFee, injectionFee, vaccineFee, testFee]);
    const form = useForm();
    return (
        <DynamicForm form={form}>
            <Box sx={{ mt: 5, border: 1, borderColor: "grey.300", borderRadius: 2, p: 5 }}>
                <Typography variant="subtitle2" sx={{ ml: 2, fontSize: "1.125rem", fontWeight: "bold" }}>
                    {t(i18n.translationKey.unpaidCost)}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid size={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>{t(i18n.translationKey.consultationFee)}:</Typography>
                            <Typography fontWeight="bold">{formatCurrencyVND(consultationFee)}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>{t(i18n.translationKey.examinationFee)}:</Typography>
                            <Typography fontWeight="bold">{formatCurrencyVND(examinationFee)}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>{t(i18n.translationKey.injectionFee)}:</Typography>
                            <Typography fontWeight="bold">{formatCurrencyVND(injectionFee)}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>{t(i18n.translationKey.vaccinePrice)}:</Typography>
                            <Typography fontWeight="bold">{formatCurrencyVND(vaccineFee)}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>{t(i18n.translationKey.examinationPrice)}:</Typography>
                            <Typography fontWeight="bold">{formatCurrencyVND(testFee)}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6" fontWeight="bold">
                                {t(i18n.translationKey.temporaryTotalUnpaidCost)}:
                            </Typography>
                            <Typography variant="h6" color="error" fontWeight="bold">
                                {formatCurrencyVND(totalUnpaid)}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </DynamicForm>
    );
};

export default UnpaidCosts;
