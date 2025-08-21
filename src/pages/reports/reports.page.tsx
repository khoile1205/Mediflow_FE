import { Box, Button, Grid, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { useAuth } from "~/contexts/auth.context";
import {
    useMutationExportHospitalRevenueReport,
    useMutationExportInventoryStatisticReport,
    useMutationExportMedicineRevenueReport,
    useMutationExportPatientStatisticReport,
} from "~/services/reports/hooks/mutations";
import {
    useQueryGetHospitalRevenueReport,
    useQueryGetInventoryStatisticReport,
    useQueryGetMedicineRevenueReport,
    useQueryGetPatientStatisticReport,
} from "~/services/reports/hooks/queries";
import { convertIsoToYYYYMMDD, formatDate } from "~/utils/date-time";
import { HospitalRevenueReport } from "./hospital-revenue.report";
import { InventoryStatisticReport } from "./inventory-statistic.report";
import { MedicineRevenueReport } from "./medicine-revenue.report";
import { PatientStatisticReport } from "./patient-statistic.report";
import { getAccessibleReportKeys, reportsDef } from "./reports.list";
import { Report, ReportKey, TDateRangeFormValue } from "./types";

const ReportPage: React.FC = () => {
    const { t } = useTranslation();
    const { userPermission } = useAuth();
    const accessibleKeys = getAccessibleReportKeys(userPermission?.roles, userPermission?.departments);
    const accessibleReports = reportsDef.filter((report) => accessibleKeys.includes(report.key));

    const [selectedReport, setSelectedReport] = React.useState<Report | null>(accessibleReports[0]);

    const form = useForm<TDateRangeFormValue>({
        defaultValues: {
            fromDate: new Date(),
            toDate: new Date(),
        },
    });

    const queryParams = {
        fromDate: convertIsoToYYYYMMDD(form.getValues("fromDate")),
        toDate: convertIsoToYYYYMMDD(form.getValues("toDate")),
    };
    const queryHooks: Record<ReportKey, any> = {
        [ReportKey.PatientStatistic]: useQueryGetPatientStatisticReport({
            params: queryParams,
            enabled: selectedReport?.key === ReportKey.PatientStatistic,
        }),
        [ReportKey.HospitalRevenue]: useQueryGetHospitalRevenueReport({
            params: queryParams,
            enabled: selectedReport?.key === ReportKey.HospitalRevenue,
        }),
        [ReportKey.SupplyInventories]: useQueryGetInventoryStatisticReport({
            params: queryParams,
            enabled: selectedReport?.key === ReportKey.SupplyInventories,
        }),
        [ReportKey.MedicineRevenue]: useQueryGetMedicineRevenueReport({
            params: queryParams,
            enabled: selectedReport?.key === ReportKey.MedicineRevenue,
        }),
    };

    const { mutateAsync: exportPatientStatistic } = useMutationExportPatientStatisticReport();
    const { mutateAsync: exportHospitalRevenue } = useMutationExportHospitalRevenueReport();
    const { mutateAsync: exportInventoryStatistic } = useMutationExportInventoryStatisticReport();
    const { mutateAsync: exportMedicineRevenue } = useMutationExportMedicineRevenueReport();

    const handleExport = async () => {
        const { fromDate, toDate } = form.getValues();
        const params = {
            fromDate: convertIsoToYYYYMMDD(fromDate),
            toDate: convertIsoToYYYYMMDD(toDate),
        };
        const fileName = getFileName(fromDate, toDate);

        let blob: Blob;
        switch (selectedReport?.key) {
            case ReportKey.PatientStatistic:
                ({ blob } = await exportPatientStatistic(params));
                break;
            case ReportKey.HospitalRevenue:
                ({ blob } = await exportHospitalRevenue(params));
                break;
            case ReportKey.SupplyInventories:
                ({ blob } = await exportInventoryStatistic(params));
                break;
            case ReportKey.MedicineRevenue:
                ({ blob } = await exportMedicineRevenue(params));
                break;
            default:
                return;
        }

        downloadFile(blob, fileName);
    };

    const handleViewReport = () => {
        if (selectedReport) {
            const activeQuery = queryHooks[selectedReport.key];
            activeQuery.refetch();
        }
    };

    const getFileName = (fromDate: Date, toDate: Date) => {
        switch (selectedReport.key) {
            case "hospital-revenue":
                return `BaoCaoDoanhThuBenhVien_${formatDate(fromDate, DATE_TIME_FORMAT["yyyyMMdd"])}_${formatDate(toDate, DATE_TIME_FORMAT["yyyyMMdd"])}.xlsx`;
            case "patient-statistic":
                return `BaoCaoThongKeBenhNhan_${formatDate(fromDate, DATE_TIME_FORMAT["yyyyMMdd"])}_${formatDate(toDate, DATE_TIME_FORMAT["yyyyMMdd"])}.xlsx`;
            case "supply-inventories":
                return `BaoCaoThongKeKhoVaccine_${formatDate(fromDate, DATE_TIME_FORMAT["yyyyMMdd"])}_${formatDate(toDate, DATE_TIME_FORMAT["yyyyMMdd"])}.xlsx`;
            case "medicine-revenue":
                return `BaoCaoDoanhSoThuoc_${formatDate(fromDate, DATE_TIME_FORMAT["yyyyMMdd"])}_${formatDate(toDate, DATE_TIME_FORMAT["yyyyMMdd"])}.xlsx`;
        }
    };

    const downloadFile = (blob: Blob, fileName: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const renderReportContent = () => {
        if (!selectedReport) return <Typography>{t(i18n.translationKey.noReportSelected)}</Typography>;

        const activeQuery = queryHooks[selectedReport.key];

        const reportData = activeQuery.data;

        if (activeQuery.isLoading) return <Typography>{t(i18n.translationKey.loading)}</Typography>;
        if (activeQuery.isError) return <Typography>{t(i18n.translationKey.errorLoadingReport)}</Typography>;
        if (!reportData) return <Typography>{t(i18n.translationKey.noDataAvailable)}</Typography>;

        switch (selectedReport.key) {
            case ReportKey.PatientStatistic:
                return <PatientStatisticReport data={reportData} />;
            case ReportKey.HospitalRevenue:
                return <HospitalRevenueReport data={reportData} />;
            case ReportKey.SupplyInventories:
                return <InventoryStatisticReport data={reportData} />;
            case ReportKey.MedicineRevenue:
                return <MedicineRevenueReport data={reportData} />;
            default:
                return <Typography>{t(i18n.translationKey.noReportSelected)}</Typography>;
        }
    };

    return (
        <Box>
            <DynamicForm form={form}>
                <Box>
                    <Grid container spacing={2}>
                        {/* Sidebar */}
                        <Grid size={3}>
                            <Paper sx={{ height: "100%", p: 1 }}>
                                <List>
                                    {accessibleReports.map((report) => (
                                        <ListItem key={report.key} disablePadding>
                                            <ListItemButton
                                                selected={selectedReport?.key === report.key}
                                                onClick={() => setSelectedReport(report)}
                                            >
                                                <ListItemText primary={t(report.name)} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                        {/* Main content */}
                        <Grid size={9}>
                            <Paper sx={{ p: 2 }}>
                                {/* Date pickers */}
                                <Grid container spacing={2} alignItems="center" mb={2}>
                                    <Grid size={6}>
                                        <FormItem
                                            name="fromDate"
                                            label={t(i18n.translationKey.from)}
                                            render="date-picker"
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <FormItem
                                            name="toDate"
                                            label={t(i18n.translationKey.to)}
                                            render="date-picker"
                                        />
                                    </Grid>
                                </Grid>

                                {/* Action buttons */}
                                <Box display="flex" gap={2} mb={2} justifyContent="flex-end">
                                    <Button variant="contained" onClick={handleViewReport}>
                                        {t(i18n.translationKey.viewReport)}
                                    </Button>
                                    <Button variant="outlined" onClick={handleExport}>
                                        {t(i18n.translationKey.exportExcel)}
                                    </Button>
                                </Box>

                                {/* Report result area */}
                                <Box
                                    sx={{
                                        backgroundColor: "#fdfde7",
                                        p: 2,
                                    }}
                                >
                                    {renderReportContent()}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </DynamicForm>
        </Box>
    );
};

export default ReportPage;
