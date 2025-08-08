import { Box, Button, Grid, InputAdornment } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import i18n from "~/configs/i18n";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { showToast } from "~/utils";
import { useMutationCreateMedicinePrice } from "~/services/inventory/hooks/mutations/use-mutation-create-medicine-price";
import { useQueryGetAllMedicines } from "~/services/inventory/hooks/queries/use-query-get-all-medicines";
import { useNavigate } from "react-router";
import { CreateMedicinePriceRequest } from "~/services/inventory/infras/types";
import { useMemo, useEffect } from "react";

const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) return "";
    return value.toLocaleString("vi-VN");
};

const parseNumber = (value: string): number => {
    if (!value) return 0;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    return Number(cleanedValue) || 0;
};

export default function CreateMedicinePricePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const form = useForm<CreateMedicinePriceRequest>({
        defaultValues: {
            medicineId: undefined,
            unitPrice: 0,
            currency: "VND",
            vatRate: 0.05,
            vatAmount: 0,
            originalPriceBeforeVat: 0,
            originalPriceAfterVat: 0,
        },
    });

    const { setValue, watch, setError, clearErrors } = form;
    const { medicines } = useQueryGetAllMedicines();
    const { mutateAsync, isPending } = useMutationCreateMedicinePrice();

    const medicineOptions = useMemo(() => {
        if (!Array.isArray(medicines)) return [];
        const uniqueMedicines = Array.from(new Map(medicines.map((med) => [med.medicineCode, med])).values());
        return uniqueMedicines
            .filter((med) => !med.unitPrice || med.unitPrice === 0 || med.unitPrice === 0.0)
            .map((med) => ({
                label: med.medicineName,
                value: med.id.toString(),
            }));
    }, [medicines]);

    const watchedMedicineId = watch("medicineId");
    const watchedUnitPrice = watch("unitPrice");
    const watchedVatRate = watch("vatRate");

    const isMedicineSelected = !!watchedMedicineId;

    useEffect(() => {
        if (!isMedicineSelected) return;

        const unitPrice = Number(watchedUnitPrice);
        const vatRate = Number(watchedVatRate);

        if (isNaN(unitPrice) || isNaN(vatRate)) return;

        if (vatRate < 0) {
            setError("vatRate", {
                type: "manual",
                message: t(i18n.translationKey.vatRateMustBePositive),
            });
        } else if (vatRate > 1) {
            setError("vatRate", {
                type: "manual",
                message: t(i18n.translationKey.vatRateTooHigh),
            });
        } else {
            clearErrors("vatRate");
        }

        const vatAmount = unitPrice * vatRate;
        const originalPriceBeforeVat = unitPrice;
        const originalPriceAfterVat = unitPrice + vatAmount;

        setValue("vatAmount", Number(vatAmount.toFixed(2)), { shouldValidate: true, shouldDirty: true });
        setValue("originalPriceBeforeVat", Number(originalPriceBeforeVat.toFixed(2)), {
            shouldValidate: true,
            shouldDirty: true,
        });
        setValue("originalPriceAfterVat", Number(originalPriceAfterVat.toFixed(2)), {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [isMedicineSelected, watchedUnitPrice, watchedVatRate, setValue, setError, clearErrors, t]);

    const onSubmit = (data: CreateMedicinePriceRequest) => {
        if (!data.medicineId) {
            showToast.error(t(i18n.translationKey.medicineIdRequired));
            return;
        }

        mutateAsync(
            { ...data, medicineId: Number(data.medicineId) },
            {
                onSuccess: () => {
                    showToast.success(t(i18n.translationKey.createMedicinePriceSuccess));
                    navigate(-1);
                },
                onError: () => {
                    showToast.error(t(i18n.translationKey.createMedicinePriceFailed));
                },
            },
        );
    };

    return (
        <Box p={3}>
            <DynamicForm form={form} onSubmit={onSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <FormItem
                            render="select"
                            name="medicineId"
                            label={t(i18n.translationKey.medicineName)}
                            options={medicineOptions}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="input-number"
                            name="unitPrice"
                            label={t(i18n.translationKey.unitPrice)}
                            required
                            disabled={!isMedicineSelected}
                            InputProps={{
                                type: "text",
                                value: formatNumber(watch("unitPrice")),
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const rawValue = parseNumber(e.target.value);
                                    setValue("unitPrice", rawValue, { shouldValidate: true, shouldDirty: true });
                                },
                                inputProps: { min: 0 },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="text-input-no-clear"
                            name="currency"
                            label={t(i18n.translationKey.currency)}
                            required
                            disabled
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="input-number"
                            name="vatRate"
                            label={t(i18n.translationKey.vatRate)}
                            required
                            disabled={!isMedicineSelected}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                inputProps: { min: 0, max: 1, step: 0.01 },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="input-number"
                            name="vatAmount"
                            label={t(i18n.translationKey.vatAmount)}
                            disabled
                            InputProps={{
                                type: "text",
                                value: formatNumber(watch("vatAmount")),
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="input-number"
                            name="originalPriceBeforeVat"
                            label={t(i18n.translationKey.originalPriceBeforeVat)}
                            disabled
                            InputProps={{
                                type: "text",
                                value: formatNumber(watch("originalPriceBeforeVat")),
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormItem
                            render="input-number"
                            name="originalPriceAfterVat"
                            label={t(i18n.translationKey.originalPriceAfterVat)}
                            disabled
                            InputProps={{
                                type: "text",
                                value: formatNumber(watch("originalPriceAfterVat")),
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Button
                            type="button"
                            fullWidth
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={() => navigate(-1)}
                        >
                            {t(i18n.translationKey.cancel)}
                        </Button>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={isPending}
                        >
                            {t(i18n.translationKey.create)}
                        </Button>
                    </Grid>
                </Grid>
            </DynamicForm>
        </Box>
    );
}
