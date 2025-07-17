import { ExpandLess, ExpandMore, FilterList } from "@mui/icons-material";
import { Avatar, Box, Button, Collapse, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { AppointmentDetailsModal } from "./appointment-detail.modal";
import { FilterVaccinationFormValue, TimeOfDay } from "./types";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Medicine } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryGetMedicinesWithPagination } from "~/services/medicine/hooks/queries";
import { useQueryGetUpcomingAppointments } from "~/services/appointments/hooks/queries";
import { AppointmentSummary } from "~/entities/appointment.entity";
import { formatDate } from "~/utils/date-time";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";

const AppointmentsManagementPage: React.FC = () => {
    const { t } = useTranslation();

    const [selectedAppointmentId, setSelectedAppointmentId] = React.useState<number | null>(null);
    const appointmentsAgGrid = useAgGrid<AppointmentSummary>({});
    const columnDefs: ColDef<AppointmentSummary>[] = [
        {
            field: "appointmentDate",
            headerName: t(i18n.translationKey.appointmentDate),
            valueFormatter: (params) => formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]),
            flex: 1,
        },
        {
            field: "patientName",
            headerName: t(i18n.translationKey.patient),
            cellRenderer: (params: ICellRendererParams<AppointmentSummary>) => {
                const { data } = params;
                const initials = data.patientName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase();

                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
                        <Box>
                            <Typography fontWeight={600}>{data.patientName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                ID: {data.patientCode} • {data.patientAge} yrs
                            </Typography>
                        </Box>
                    </Box>
                );
            },
            flex: 1,
        },
        {
            field: "vaccineName",
            headerName: t(i18n.translationKey.medicineName),
            flex: 1,
        },
        {
            field: "dose",
            headerName: t(i18n.translationKey.dose),
            flex: 1,
        },
        {
            cellRenderer: (params: ICellRendererParams<AppointmentSummary>) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        setSelectedAppointmentId(params.data.id);
                        setOpen(true);
                    }}
                >
                    {t(i18n.translationKey.view)}
                </Button>
            ),
            flex: 0.5,
        },
    ];
    const appointmentFilterForm = useForm<FilterVaccinationFormValue>({
        defaultValues: {
            fromDate: null,
            toDate: null,
            timeOfDay: null,
            vaccineId: null,
        },
    });

    const {
        pageSize: medicinePageSize,
        handlePageChange: handleMedicinePageChange,
        pageIndex: medicinePageIndex,
    } = usePagination();
    const [searchMedicineTerm, setSearchMedicineTerm] = React.useState<string>("");
    const {
        data: { listMedicines, totalItems: totalMedicinesItem },
    } = useQueryGetMedicinesWithPagination({
        pageIndex: medicinePageIndex,
        pageSize: medicinePageSize,
        searchKeyword: searchMedicineTerm,
    });

    const {
        pageSize: appointmentPageSize,
        handlePageChange: handleAppointmentPageChange,
        pageIndex: appointmentPageIndex,
    } = usePagination();
    const {
        data: { listAppointments, totalItems: totalAppointmentsItems },
        refetch,
    } = useQueryGetUpcomingAppointments({
        pageIndex: appointmentPageIndex,
        pageSize: appointmentPageSize,
        fromDate: appointmentFilterForm.watch("fromDate"),
        toDate: appointmentFilterForm.watch("toDate"),
        timeOfDay: appointmentFilterForm.watch("timeOfDay"),
        vaccineId: appointmentFilterForm.watch("vaccineId"),
    });

    const [filtersExpanded, setFiltersExpanded] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    return (
        <DynamicForm form={appointmentFilterForm}>
            <Box
                component="main"
                sx={{
                    p: 3,
                    mt: { xs: 8, lg: 0 },
                }}
            >
                <Typography variant="h5" fontWeight="600" color="text.primary" gutterBottom>
                    {t(i18n.translationKey.followUpAppointments)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t(i18n.translationKey.followUpAppointmentsDescription)}
                </Typography>

                <Paper sx={{ my: 3 }}>
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => setFiltersExpanded(!filtersExpanded)}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <FilterList sx={{ mr: 1, color: "text.secondary" }} />
                            <Typography>{t(i18n.translationKey.filterAppointments)}</Typography>
                        </Box>
                        {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                    <Collapse in={filtersExpanded} sx={{}}>
                        <Box sx={{ pt: 3, px: 3, pb: 3, borderTop: "2px solid #e0e0e0" }}>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                {/* Date Range Filter */}
                                <Grid size={{ xs: 12, xl: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.dateRange)}
                                    </Typography>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={{ xs: 5.5, xl: 5 }}>
                                            <FormItem render="date-picker" name="fromDate" />
                                        </Grid>
                                        <Grid size={{ xs: 1, xl: 2 }} sx={{ textAlign: "center" }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {t(i18n.translationKey.to)}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 5.5, xl: 5 }}>
                                            <FormItem
                                                render="date-picker"
                                                name="toDate"
                                                minDate={appointmentFilterForm.watch("fromDate")}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* Time of Day Filter */}
                                <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.timeOfDay)}
                                    </Typography>
                                    <FormItem
                                        render="select"
                                        name="timeOfDay"
                                        options={[
                                            {
                                                value: null,
                                                label: t(i18n.translationKey.allTimes),
                                            },
                                            {
                                                value: TimeOfDay.Morning,
                                                label: t(i18n.translationKey.morning8am12pm),
                                            },
                                            {
                                                value: TimeOfDay.Afternoon,
                                                label: t(i18n.translationKey.afternoon12pm5pm),
                                            },
                                            {
                                                value: TimeOfDay.Evening,
                                                label: t(i18n.translationKey.evening5pm8pm),
                                            },
                                        ]}
                                    />
                                </Grid>
                                {/* Vaccine Type */}
                                <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.vaccineType)}
                                    </Typography>
                                    <FormItem
                                        render="data-grid"
                                        name="vaccineId"
                                        columnDefs={
                                            [
                                                {
                                                    field: "medicineCode",
                                                    headerName: t(i18n.translationKey.medicalCode),
                                                    flex: 1,
                                                },
                                                {
                                                    field: "medicineName",
                                                    headerName: t(i18n.translationKey.medicineName),
                                                    flex: 1,
                                                },
                                            ] as ColDef<Medicine>[]
                                        }
                                        pageSize={medicinePageSize}
                                        pagination
                                        pageIndex={medicinePageIndex}
                                        totalItems={totalMedicinesItem}
                                        onPageChange={handleMedicinePageChange}
                                        onSearch={(value) => setSearchMedicineTerm(value)}
                                        rowData={listMedicines}
                                        displayField="medicineName"
                                        valueField="id"
                                    />
                                </Grid>

                                {/* Dose Number */}
                                {/* <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.dose)}
                                    </Typography>
                                    <FormItem render="select" name="doseNumber" options={[]} />
                                </Grid> */}
                                {/* Status Filter */}
                                {/* <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.status)}
                                    </Typography>
                                    <FormItem
                                        render="select"
                                        name="status"
                                        options={[{ value: "all", label: "All Statuses" }]}
                                    />
                                </Grid> */}
                                {/* Patient Age Group */}
                                {/* <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.ageGroup)}
                                    </Typography>
                                    <FormItem
                                        render="select"
                                        name="ageGroup"
                                        options={[
                                            { value: "all", label: "All Ages" },
                                            { value: "0-5", label: t(i18n.translationKey.age0To5Years) },
                                            { value: "6-12", label: t(i18n.translationKey.age6To12Years) },
                                            { value: "13-18", label: t(i18n.translationKey.age13To18Years) },
                                            { value: "19-64", label: t(i18n.translationKey.age19To64Years) },
                                            { value: "65+", label: t(i18n.translationKey.age65PlusYears) },
                                        ]}
                                    />
                                </Grid> */}
                            </Grid>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        appointmentFilterForm.reset();
                                        setSearchMedicineTerm("");
                                    }}
                                >
                                    {t(i18n.translationKey.reset)}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        refetch();
                                    }}
                                >
                                    {t(i18n.translationKey.applyFilters)}
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Paper>

                <AgDataGrid
                    {...appointmentsAgGrid}
                    rowData={listAppointments}
                    columnDefs={columnDefs}
                    totalItems={totalAppointmentsItems}
                    pageSize={appointmentPageSize}
                    pagination
                    pageIndex={appointmentPageIndex}
                    onPageChange={handleAppointmentPageChange}
                />
            </Box>
            <AppointmentDetailsModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setSelectedAppointmentId(null);
                }}
                appointmentId={selectedAppointmentId}
            />
        </DynamicForm>
    );
};

export default AppointmentsManagementPage;
