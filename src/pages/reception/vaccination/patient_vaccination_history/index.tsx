import { Box, Grid, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";

interface VaccinationHistoryRow {
    vaccineSerumType: string;
    vaccineSerumName: string;
    doseNumber: string;
    injectionDate: string;
    appointmentDate: string;
    confirmationStatus: string;
    doctor: string;
}

export const PatientVaccinationHistory: React.FC = () => {
    const { t } = useTranslation();
    const form = useForm();
    const agGrid = useAgGrid<VaccinationHistoryRow>({ rowSelection: "multiple" });

    const columnDefs: ColDef<VaccinationHistoryRow>[] = [
        {
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: true,
            resizable: false,
        },
        { field: "vaccineSerumType", headerName: t(i18n.translationKey.vaccineSerumType) },
        { field: "vaccineSerumName", headerName: t(i18n.translationKey.vaccineSerumName) },
        { field: "doseNumber", headerName: t(i18n.translationKey.doseNumber) },
        { field: "injectionDate", headerName: t(i18n.translationKey.injectionDate) },
        { field: "appointmentDate", headerName: t(i18n.translationKey.appointmentDate) },
        { field: "confirmationStatus", headerName: t(i18n.translationKey.vaccinationConfirmation) },
        { field: "doctor", headerName: t(i18n.translationKey.instructedDoctor) },
    ];

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ flex: 1, p: 3 }}>
                <DynamicForm form={form}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                                {t(i18n.translationKey.vaccinationHistory)}
                            </Typography>
                            <Box className="mt-2 border p-5" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                                <Grid container spacing={2.5} alignItems="flex-start">
                                    <Grid size={3}>
                                        <FormItem
                                            render="text-input"
                                            name="medicalCode"
                                            label={t(i18n.translationKey.medicalCode)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <FormItem
                                            render="text-input"
                                            name="vaccinationNumber"
                                            label={t(i18n.translationKey.vaccinationNumber)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <FormItem
                                            render="text-input"
                                            name="fullName"
                                            label={t(i18n.translationKey.patientName)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <FormItem
                                            render="text-input"
                                            name="gender"
                                            label={t(i18n.translationKey.gender)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <FormItem
                                            render="text-input"
                                            name="phoneNumber"
                                            label={t(i18n.translationKey.phoneNumber)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <FormItem
                                            render="text-input"
                                            name="address"
                                            label={t(i18n.translationKey.address)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <FormItem
                                            render="text-input"
                                            name="ward"
                                            label={t(i18n.translationKey.ward)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <FormItem
                                            render="text-input"
                                            name="district"
                                            label={t(i18n.translationKey.district)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <FormItem
                                            render="text-input"
                                            name="city"
                                            label={t(i18n.translationKey.province)}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>

                                <Box
                                    mt={2}
                                    className="ag-theme-alpine custom-grid-style"
                                    sx={{ height: 300, width: "100%" }}
                                >
                                    <AgDataGrid columnDefs={columnDefs} rowData={[]} {...agGrid} />
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </DynamicForm>
            </Box>

            {/* Inline CSS for styling ag-Grid */}
            <style>
                {`
                    .custom-grid-style .ag-header {
                        background-color: #F8F5D7 !important;
                    }

                    .custom-grid-style .ag-header-cell {
                        background-color: #F8F5D7 !important;
                        font-weight: bold;
                        font-size: 14px;
                        text-align: center;
                        border-right: 1px solid #e0e0e0;
                    }

                    .custom-grid-style .ag-cell {
                        font-size: 13px;
                        border-right: 1px solid #e0e0e0;
                        line-height: 20px;
                    }

                    .custom-grid-style .ag-row {
                        border-bottom: 1px solid #e0e0e0;
                    }

                    .custom-grid-style .ag-root-wrapper {
                        border-radius: 8px;
                        overflow: hidden;
                    }
                `}
            </style>
        </Box>
    );
};

export default PatientVaccinationHistory;
