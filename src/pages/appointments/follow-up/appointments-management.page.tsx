import { ExpandLess, ExpandMore, FilterList } from "@mui/icons-material";
import { Box, Button, Collapse, Grid, Paper, Typography } from "@mui/material";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { DEFAULT_PAGINATION_PARAMS } from "~/constants/pagination";
import { Medicine } from "~/entities";
import { AppointmentSummary } from "~/entities/appointment.entity";
import { usePagination } from "~/hooks";
import { IPaginationRequest } from "~/libs/axios/types";
import { useQueryGetUpcomingAppointments } from "~/services/appointments/hooks/queries";
import { IAppointmentFilter } from "~/services/appointments/infras";
import { useQueryGetMedicinesWithPagination } from "~/services/medicine/hooks/queries";
import { convertIsoToYYYYMMDD, formatDate } from "~/utils/date-time";
import { AppointmentDetailsModal } from "./appointment-detail.modal";
import { FilterVaccinationFormValue, TimeOfDay } from "./types";

const AppointmentsManagementPage: React.FC = () => {
    const { t } = useTranslation();

    const [selectedAppointmentId, setSelectedAppointmentId] = React.useState<number | null>(null);
    const appointmentsAgGrid = useAgGrid<AppointmentSummary>({});
    const columnDefs: ColDef<AppointmentSummary>[] = [
        {
            field: "patientCode",
            headerName: t(i18n.translationKey.medicalCode),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            field: "patientName",
            headerName: t(i18n.translationKey.patient),
            cellClass: "ag-cell-center",

            flex: 1,
        },
        {
            field: "vaccineName",
            headerName: t(i18n.translationKey.medicineName),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            field: "appointmentDate",
            headerName: t(i18n.translationKey.appointmentDate),
            valueFormatter: (params) => formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]),
            cellClass: "ag-cell-center",
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
            cellClass: "ag-cell-center",
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

    // Medicines Query
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

    // Upcoming Appointments Query
    const [appliedAppointmentFilters, setAppliedAppointmentFilters] = React.useState<
        IPaginationRequest & IAppointmentFilter
    >({
        pageIndex: DEFAULT_PAGINATION_PARAMS.PAGE_INDEX,
        pageSize: DEFAULT_PAGINATION_PARAMS.PAGE_SIZE,
    });
    const { pageSize: appointmentPageSize, pageIndex: appointmentPageIndex } = usePagination();
    const {
        data: { listAppointments, totalItems: totalAppointmentsItems },
    } = useQueryGetUpcomingAppointments(appliedAppointmentFilters);
    console.log("appliedAppointmentFilters", appliedAppointmentFilters);
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
                                            <FormItem
                                                render="date-picker"
                                                name="fromDate"
                                                maxDate={appointmentFilterForm.watch("toDate")}
                                            />
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
                                                value: TimeOfDay.All_Day,
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
                            </Grid>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        appointmentFilterForm.reset();
                                    }}
                                >
                                    {t(i18n.translationKey.reset)}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        const values = appointmentFilterForm.getValues();

                                        setAppliedAppointmentFilters({
                                            pageIndex: appointmentPageIndex,
                                            pageSize: appointmentPageSize,
                                            fromDate: values.fromDate
                                                ? convertIsoToYYYYMMDD(values.fromDate)
                                                : undefined,
                                            toDate: values.toDate ? convertIsoToYYYYMMDD(values.toDate) : undefined,
                                            timeOfDay: values.timeOfDay ? values.timeOfDay : undefined,
                                            vaccineId: values.vaccineId ? values.vaccineId : undefined,
                                        });
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
                    pageSize={appliedAppointmentFilters.pageSize}
                    pagination
                    pageIndex={appliedAppointmentFilters.pageIndex}
                    onPageChange={(newPageIndex, newPageSize) => {
                        setAppliedAppointmentFilters((prev) => ({
                            ...prev,
                            pageIndex: newPageIndex,
                            pageSize: newPageSize,
                        }));
                    }}
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
