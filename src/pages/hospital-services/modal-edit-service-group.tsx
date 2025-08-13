import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DynamicForm from "~/components/form/dynamic-form";
import i18n from "~/configs/i18n";
import { IBaseApiResponse } from "~/libs/axios/types";
import { useQueryGetHospitalServices } from "~/services/hospital-service/hooks/queries/use-query-get-hospital-services";
import {
    CreateHospitalServiceGroupRequest,
    UpdateHospitalServiceGroupRequest,
} from "~/services/hospital-service/infras/types";
import { showToast } from "~/utils";
import { HospitalServiceGroup, HospitalServiceListResponse } from "./types";

interface Props {
    open: boolean;
    defaultValues: HospitalServiceGroup | null;
    onClose: () => void;
    onSuccess: (updatedGroup?: HospitalServiceGroup | null) => void;
    createMutation: UseMutationResult<
        IBaseApiResponse<HospitalServiceGroup>,
        Error,
        CreateHospitalServiceGroupRequest,
        unknown
    >;
    updateMutation: UseMutationResult<
        IBaseApiResponse<HospitalServiceGroup | number>,
        Error,
        UpdateHospitalServiceGroupRequest,
        unknown
    >;
}

interface FormValues {
    groupName: string;
    serviceIds: string[];
}

export default function ModalEditServiceGroup({
    open,
    defaultValues,
    onClose,
    onSuccess,
    createMutation,
    updateMutation,
}: Props) {
    const { t } = useTranslation();
    const form = useForm<FormValues>({
        defaultValues: {
            groupName: defaultValues?.groupName || "",
            serviceIds: defaultValues ? [] : [],
        },
    });
    const { control, handleSubmit, reset, watch } = form;

    const { data } = useQueryGetHospitalServices() as { data: HospitalServiceListResponse };

    useEffect(() => {
        reset({
            groupName: defaultValues?.groupName || "",
            serviceIds: defaultValues ? [] : [],
        });
    }, [defaultValues, reset]);

    const onSubmit = (data: FormValues) => {
        const { groupName, serviceIds } = data;
        const trimmedName = groupName.trim();

        if (!trimmedName) {
            showToast.error(t(i18n.translationKey.invalidInput));
            return;
        }

        if (defaultValues) {
            updateMutation.mutate(
                {
                    id: defaultValues.id,
                    groupName: trimmedName,
                },
                {
                    onSuccess: () => {
                        showToast.success(t(i18n.translationKey.updateHospitalServiceGroupSuccess));
                        onSuccess(undefined);
                        onClose();
                    },
                    onError: () => {
                        showToast.error(t(i18n.translationKey.updateHospitalServiceGroupFailed));
                    },
                },
            );
        } else {
            createMutation.mutate(
                {
                    groupName: trimmedName,
                    serviceIds: serviceIds.map(Number),
                },
                {
                    onSuccess: (response) => {
                        showToast.success(t(i18n.translationKey.createHospitalServiceGroupSuccess));
                        onSuccess(response.Data);
                        onClose();
                    },
                    onError: () => {
                        showToast.error(t(i18n.translationKey.createHospitalServiceGroupFailed));
                    },
                },
            );
        }
    };

    const selectedServices = watch("serviceIds");
    const totalServices = selectedServices.length;
    const totalPrice =
        data?.Data?.filter((s) => selectedServices.includes(s.id.toString())).reduce(
            (sum, s) => sum + s.unitPrice,
            0,
        ) || 0;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {defaultValues
                    ? t(i18n.translationKey.editHospitalServiceGroup)
                    : t(i18n.translationKey.createHospitalServiceGroup)}
            </DialogTitle>
            <DialogContent dividers>
                <DynamicForm form={form}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="groupName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t(i18n.translationKey.serviceGroupName)}
                                        required
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        {!defaultValues && data?.Data && (
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="serviceIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            options={data.Data.map((service) => ({
                                                label: `${service.serviceName} - ${service.unitPrice.toLocaleString()} VND`,
                                                value: service.id.toString(),
                                            }))}
                                            getOptionLabel={(option) => option.label}
                                            value={data.Data.filter((s) => field.value.includes(s.id.toString())).map(
                                                (s) => ({
                                                    label: `${s.serviceName} - ${s.unitPrice.toLocaleString()} VND`,
                                                    value: s.id.toString(),
                                                }),
                                            )}
                                            onChange={(_, newValue) => field.onChange(newValue.map((v) => v.value))}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t(i18n.translationKey.selectServices)}
                                                    placeholder={t(i18n.translationKey.selectServices)}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        )}
                        {!defaultValues && selectedServices.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 2,
                                        backgroundColor: "#f7f9fc",
                                    }}
                                >
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {t(i18n.translationKey.summary)}
                                        </Typography>
                                        <Typography>
                                            {t(i18n.translationKey.totalServices)}: {totalServices}
                                        </Typography>
                                        <Typography>
                                            {t(i18n.translationKey.totalPrice)}: {totalPrice.toLocaleString()} VND
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </DynamicForm>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    {t(i18n.translationKey.cancel)}
                </Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained">
                    {t(i18n.translationKey.save)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
