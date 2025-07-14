import { ExpandLess, ExpandMore, FilterList } from "@mui/icons-material";
import { Box, Button, Collapse, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { AppointmentDetailsModal } from "./appointment-detail.modal";

const AppointmentsManagementPage: React.FC = () => {
    const { t } = useTranslation();
    const appointmentsAgGrid = useAgGrid({});
    const appointmentFilterForm = useForm();

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
                        <Box sx={{ pt: 3, px: 3, pb: 3, borderTop: "1px solid #e0e0e0" }}>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                {/* Date Range Filter */}
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.dateRange)}
                                    </Typography>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={{ xs: 5 }}>
                                            <FormItem render="date-picker" name="startDate" />
                                        </Grid>
                                        <Grid size={{ xs: 2 }} sx={{ textAlign: "center" }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {t(i18n.translationKey.to)}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 5 }}>
                                            <FormItem
                                                render="date-picker"
                                                name="endDate"
                                                minDate={appointmentFilterForm.watch("startDate")}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* Time of Day Filter */}
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.timeOfDay)}
                                    </Typography>
                                    <FormItem
                                        render="select"
                                        name="timeOfDay"
                                        options={[
                                            {
                                                value: "all",
                                                label: t(i18n.translationKey.allTimes),
                                            },
                                            {
                                                value: "morning",
                                                label: t(i18n.translationKey.morning8am12pm),
                                            },
                                            {
                                                value: "afternoon",
                                                label: t(i18n.translationKey.afternoon12pm5pm),
                                            },
                                            {
                                                value: "evening",
                                                label: t(i18n.translationKey.evening5pm8pm),
                                            },
                                        ]}
                                    />
                                </Grid>
                                {/* Vaccine Type */}
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.vaccineType)}
                                    </Typography>
                                    <FormItem
                                        render="select"
                                        name="vaccineType"
                                        options={[
                                            {
                                                value: "all",
                                                label: "All Vaccines",
                                            },
                                        ]}
                                    />
                                </Grid>

                                {/* Dose Number */}
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.dose)}
                                    </Typography>
                                    <FormItem render="select" name="doseNumber" options={[]} />
                                </Grid>
                                {/* Status Filter */}
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t(i18n.translationKey.status)}
                                    </Typography>
                                    <FormItem
                                        render="select"
                                        name="status"
                                        options={[{ value: "all", label: "All Statuses" }]}
                                    />
                                </Grid>
                                {/* Patient Age Group */}
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
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
                                </Grid>
                            </Grid>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <Button variant="outlined">{t(i18n.translationKey.reset)}</Button>
                                <Button variant="contained">{t(i18n.translationKey.applyFilters)}</Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Paper>

                <AgDataGrid {...appointmentsAgGrid} rowData={[]} columnDefs={[]} />
            </Box>
            <AppointmentDetailsModal open={open} onClose={() => setOpen(false)} />
        </DynamicForm>
    );
};

export default AppointmentsManagementPage;
