import { AddCircle, Delete, DoNotDisturb, Done } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Grid, IconButton, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n"; // Adjust the path to your i18n setup

interface TableRowData {
    type: string;
    name: string;
    quantity: number;
    dose: string;
    usage: string;
    usageDate: string;
    invoiceDate: string;
    appointmentDate: string;
    payment: string;
    confirmation: string;
    note: string;
}

export const VaccinationIndication: React.FC = () => {
    const { t } = useTranslation();
    const form = useForm();
    const agGrid = useAgGrid<TableRowData>({ rowSelection: "multiple" });

    const columnDefs: ColDef<TableRowData>[] = [
        {
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: true,
            resizable: false,
        },
        { field: "type", headerName: t(i18n.translationKey.vaccineSerumType) },
        { field: "name", headerName: t(i18n.translationKey.vaccineSerumName) },
        { field: "quantity", headerName: t(i18n.translationKey.quantity), cellClass: "ag-cell-center" },
        { field: "dose", headerName: t(i18n.translationKey.doseNumber) },
        { field: "usage", headerName: t(i18n.translationKey.allowUsage) },
        { field: "usageDate", headerName: t(i18n.translationKey.usageDate) },
        { field: "invoiceDate", headerName: t(i18n.translationKey.invoiceDate) },
        { field: "appointmentDate", headerName: t(i18n.translationKey.appointmentDate) },
        { field: "payment", headerName: t(i18n.translationKey.payment) },
        { field: "confirmation", headerName: t(i18n.translationKey.vaccinationConfirmation) },
        { field: "note", headerName: t(i18n.translationKey.note) },
    ];

    return (
        <DynamicForm form={form}>
            <Stack spacing={2} className="pt-3">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        {t(i18n.translationKey.vaccinationIndication)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                        <Grid container spacing={2.5} alignItems="flex-start">
                            <Grid size={3}>
                                <FormItem
                                    render="select"
                                    name="vaccine"
                                    label={t(i18n.translationKey.vaccine)}
                                    placeholder={t(i18n.translationKey.selectVaccine)}
                                    options={[]}
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormItem
                                    render="input-number"
                                    name="quantity"
                                    label={t(i18n.translationKey.quantity)}
                                    placeholder="0"
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormItem
                                    render="select"
                                    name="dose"
                                    label={t(i18n.translationKey.doseNumber)}
                                    placeholder={t(i18n.translationKey.selectDose)}
                                    options={[]}
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormItem
                                    render="date-picker"
                                    name="appointmentDate"
                                    label={t(i18n.translationKey.appointmentDate)}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    render="text-input"
                                    name="note"
                                    label={t(i18n.translationKey.note)}
                                    placeholder={t(i18n.translationKey.note)}
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true },
                                        endAdornment: <IconButton size="small">✕</IconButton>,
                                    }}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    useFlexGap
                                    flexWrap="wrap"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Stack direction="row" spacing={1}>
                                        <ActionButton
                                            label={t(i18n.translationKey.addNew)}
                                            startIcon={<AddCircle />}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                                borderColor: "grey.400",
                                                color: "grey.600",
                                            }}
                                        />
                                        <ActionButton
                                            label={t(i18n.translationKey.delete)}
                                            startIcon={<Delete />}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                                borderColor: "grey.400",
                                                color: "grey.600",
                                            }}
                                        />
                                        <ActionButton
                                            label={t(i18n.translationKey.deleteSelectedIndications)}
                                            startIcon={<Delete />}
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            sx={{ borderRadius: 4, px: 2 }}
                                        />
                                    </Stack>
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked sx={{ p: 0.5 }} />}
                                        label={
                                            <Typography fontWeight="bold">{t(i18n.translationKey.useToday)}</Typography>
                                        }
                                    />
                                    <Stack direction="row" spacing={1}>
                                        <ActionButton
                                            label={t(i18n.translationKey.approveUsage)}
                                            startIcon={<Done />}
                                            size="small"
                                            color="success"
                                            variant="contained"
                                            sx={{ borderRadius: 4, px: 2 }}
                                        />
                                        <ActionButton
                                            label={t(i18n.translationKey.disapproveUsage)}
                                            startIcon={<DoNotDisturb />}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                                borderColor: "grey.400",
                                                color: "grey.600",
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        {t(i18n.translationKey.vaccinationIndicationList)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                        <AgDataGrid columnDefs={columnDefs} rowData={[]} {...agGrid} />
                    </Box>
                </Box>
            </Stack>
        </DynamicForm>
    );
};

export default VaccinationIndication;
