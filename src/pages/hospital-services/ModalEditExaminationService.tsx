import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import AgDataGrid from "~/components/common/ag-grid/ag-grid";
import { useAgGrid } from "~/components/common/ag-grid/hooks";
import Dialog from "~/components/common/dialog/dialog";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import { ExaminationService } from "~/services/hospital-service/infras/types";
import { useQueryDepartmentsWithPagination } from "~/services/management/department/hooks/queries/use-query-departments-with-pagination";

interface ServiceTestParameter {
    parameterName: string;
    unit: string;
    standardValue: string;
    equipmentName: string;
    specimenType: string;
    serviceId: number;
    id: number;
    isSuspended: boolean;
    isCancelled: boolean;
    createdAt: string;
    createdBy: number;
    lastUpdatedAt: string;
    lastUpdatedBy: number;
    index?: number;
}

interface ExaminationServiceWithParams extends ExaminationService {
    serviceTestParameters: ServiceTestParameter[];
}

interface ExaminationServiceFormValues {
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: string;
}

interface ModalEditExaminationServiceProps {
    open: boolean;
    defaultValues: ExaminationServiceWithParams | null;
    onClose: () => void;
    onSave: (
        data: ExaminationServiceFormValues & { id?: number; serviceTestParameters: ServiceTestParameter[] },
    ) => void;
}

function ModalEditExaminationService({ open, defaultValues, onClose, onSave }: ModalEditExaminationServiceProps) {
    const { t } = useTranslation();
    const { data: departmentData } = useQueryDepartmentsWithPagination({
        pageIndex: 1,
        pageSize: 1000,
    });

    const form = useForm<ExaminationServiceFormValues>({
        defaultValues: {
            serviceCode: "",
            serviceName: "",
            unitPrice: 0,
            departmentId: "",
        },
    });

    const [serviceTestParams, setServiceTestParams] = useState<ServiceTestParameter[]>([]);
    const paramForm = useForm<ServiceTestParameter>({
        defaultValues: {
            parameterName: "",
            unit: "",
            standardValue: "",
            equipmentName: "",
            specimenType: "",
            serviceId: defaultValues?.id || 0,
        },
    });

    useEffect(() => {
        if (open && defaultValues) {
            form.reset({
                serviceCode: defaultValues.serviceCode || "",
                serviceName: defaultValues.serviceName || "",
                unitPrice: defaultValues.unitPrice || 0,
                departmentId: defaultValues.departmentId?.toString() || "",
            });
            setServiceTestParams(
                defaultValues.serviceTestParameters.map((param) => ({
                    ...param,
                    serviceId: defaultValues.id || 0,
                })) || [],
            );
        } else if (open && !defaultValues) {
            form.reset({
                serviceCode: "",
                serviceName: "",
                unitPrice: 0,
                departmentId: "",
            });
            setServiceTestParams([]);
            paramForm.reset({
                parameterName: "",
                unit: "",
                standardValue: "",
                equipmentName: "",
                specimenType: "",
                serviceId: 0,
            });
        }
    }, [open, defaultValues, form]);

    const handleAddParam = () => {
        const values = paramForm.getValues();
        if (
            values.parameterName &&
            values.unit &&
            values.standardValue &&
            values.equipmentName &&
            values.specimenType
        ) {
            const newParam: ServiceTestParameter = {
                ...values,
                id: Date.now(),
                isSuspended: false,
                isCancelled: false,
                createdAt: new Date().toISOString(),
                createdBy: 0,
                lastUpdatedAt: new Date().toISOString(),
                lastUpdatedBy: 0,
                index: serviceTestParams.length + 1,
            };
            setServiceTestParams([...serviceTestParams, newParam]);
            paramForm.reset({
                parameterName: "",
                unit: "",
                standardValue: "",
                equipmentName: "",
                specimenType: "",
                serviceId: defaultValues?.id || 0,
            });
        }
    };

    const handleSubmit = () => {
        const values = form.getValues();
        onSave({
            id: defaultValues?.id,
            serviceCode: values.serviceCode,
            serviceName: values.serviceName,
            unitPrice: Number(values.unitPrice),
            departmentId: values.departmentId,
            serviceTestParameters: serviceTestParams.map((param) => ({
                ...param,
                serviceId: defaultValues?.id || 0,
            })),
        });
    };

    const departmentOptions = useMemo(() => {
        if (!departmentData?.listDepartments) return [];
        return departmentData.listDepartments.map((dept) => ({
            value: dept.id.toString(),
            label: dept.name,
        }));
    }, [departmentData]);

    const paramColumns = useMemo(
        () => [
            { headerName: t(i18n.translationKey.parameterName), field: "parameterName", flex: 2 },
            { headerName: t(i18n.translationKey.unit), field: "unit", flex: 1 },
            { headerName: t(i18n.translationKey.standardValue), field: "standardValue", flex: 1 },
            { headerName: t(i18n.translationKey.equipmentName), field: "equipmentName", flex: 2 },
            { headerName: t(i18n.translationKey.specimenType), field: "specimenType", flex: 1 },
        ],
        [t],
    );

    const { onGridReady } = useAgGrid({});

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                {defaultValues
                    ? t(i18n.translationKey.editExaminationService)
                    : t(i18n.translationKey.createExaminationService)}
            </DialogTitle>
            <DialogContent dividers>
                <DynamicForm form={form}>
                    <Box
                        sx={{
                            backgroundColor: "primary.dark",
                            color: "white",
                            py: { xs: 2, sm: 3 },
                            pl: { xs: 2, sm: 4, md: 8 },
                            fontWeight: 600,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">{t(i18n.translationKey.examinationServiceInformation)}</Typography>
                    </Box>
                    <Box
                        sx={{
                            borderColor: "primary.main",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderRadius: 2,
                            p: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <FormItem
                                    name="serviceCode"
                                    label={t(i18n.translationKey.serviceCode)}
                                    render="text-input"
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <FormItem
                                    name="serviceName"
                                    label={t(i18n.translationKey.serviceName)}
                                    render="text-input"
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <FormItem
                                    name="unitPrice"
                                    label={t(i18n.translationKey.price)}
                                    render="input-number"
                                    required
                                    slotProps={{
                                        input: {
                                            endAdornment: "VND",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <FormItem
                                    name="departmentId"
                                    label={t(i18n.translationKey.department)}
                                    render="autocomplete"
                                    options={departmentOptions}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DynamicForm>

                <Box sx={{ mt: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            backgroundColor: "primary.dark",
                            color: "white",
                            py: { xs: 2, sm: 3 },
                            pl: { xs: 2, sm: 4, md: 8 },
                            fontWeight: 600,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                            mb: 2,
                        }}
                    >
                        {t(i18n.translationKey.testParameters)}
                    </Typography>
                    <Box
                        sx={{
                            borderColor: "primary.main",
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderRadius: 2,
                            p: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        <DynamicForm form={paramForm}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormItem
                                        name="parameterName"
                                        label={t(i18n.translationKey.parameterName)}
                                        render="text-input"
                                        required
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <FormItem
                                        name="unit"
                                        label={t(i18n.translationKey.unit)}
                                        render="text-input"
                                        required
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <FormItem
                                        name="standardValue"
                                        label={t(i18n.translationKey.standardValue)}
                                        render="text-input"
                                        required
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormItem
                                        name="equipmentName"
                                        label={t(i18n.translationKey.equipmentName)}
                                        render="text-input"
                                        required
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <FormItem
                                        name="specimenType"
                                        label={t(i18n.translationKey.specimenType)}
                                        render="text-input"
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </DynamicForm>

                        {serviceTestParams.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <AgDataGrid
                                    onGridReady={onGridReady}
                                    columnDefs={paramColumns}
                                    rowData={serviceTestParams}
                                    rowSelection="multiple"
                                    pagination
                                    pageSize={5}
                                    loading={false}
                                />
                            </Box>
                        )}
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="end"
                            spacing={{ xs: 1, sm: 2 }}
                            sx={{ mt: 2 }}
                        >
                            <ActionButton
                                label={t(i18n.translationKey.addNew)}
                                startIcon={<AddCircle />}
                                size="small"
                                variant="contained"
                                onClick={handleAddParam}
                                sx={{ borderRadius: 4, px: { xs: 1, sm: 2 } }}
                            />
                            <ActionButton
                                label={t(i18n.translationKey.delete)}
                                startIcon={<Delete />}
                                size="small"
                                disabled={serviceTestParams.length === 0}
                                onClick={() => {
                                    const selectedRows = serviceTestParams.filter(
                                        (_, i) => i === serviceTestParams.length - 1,
                                    );
                                    if (selectedRows.length > 0) {
                                        setServiceTestParams(
                                            serviceTestParams.filter((_, i) => i !== serviceTestParams.length - 1),
                                        );
                                    }
                                }}
                                sx={{
                                    borderRadius: 4,
                                    px: { xs: 1, sm: 2 },
                                    borderColor: "grey.400",
                                    color: "grey.600",
                                }}
                            />
                        </Stack>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    {t(i18n.translationKey.cancel)}
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    {t(i18n.translationKey.save)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalEditExaminationService;
