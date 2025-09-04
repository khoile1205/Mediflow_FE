import { ArrowBack, Visibility } from "@mui/icons-material";
import { Box, Chip, Grid, IconButton, Link, Paper, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import i18n from "~/configs/i18n";
import ExaminationDetailModal from "./examination-detail.modal";
import { useQueryGetPatientExaminationHistory } from "~/services/examination/hooks/queries";
import { formatDate } from "~/utils/date-time";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { CustomCellRendererProps } from "ag-grid-react";

const ExaminationPatientHistoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [examinationId, setExaminationId] = React.useState<number>(null);

    const { t } = useTranslation();
    const agGrid = useAgGrid({});

    const [open, setOpen] = React.useState<boolean>(false);
    // Find patient by id

    const {
        data: { patientExaminationHistory },
    } = useQueryGetPatientExaminationHistory(Number(id));
    if (!patientExaminationHistory) return null;

    return (
        <Box sx={{ bgcolor: "#fff", minHeight: "100vh", p: { xs: 2, md: 4 } }}>
            {/* Top bar */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                    {t(i18n.translationKey.patientExaminationHistory, {
                        patient_name: patientExaminationHistory.patientName,
                    })}
                </Typography>
                <Link
                    component="button"
                    underline="none"
                    color="primary"
                    fontWeight={500}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    onClick={() => navigate("/examination/history/patients")}
                >
                    <ArrowBack fontSize="small" sx={{ mr: 0.5 }} /> {t(i18n.translationKey.backToPatients)}
                </Link>
            </Box>

            {/* Patient Info Card */}
            <Paper elevation={0} sx={{ borderRadius: 3, p: 3, mb: 4, bgcolor: "#f6f7fa" }}>
                <Typography fontWeight={600} mb={2} fontSize={18}>
                    {t(i18n.translationKey.patientInformation)}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {t(i18n.translationKey.medicalCode)}
                        </Typography>
                        <Typography fontWeight={600}>{patientExaminationHistory.patientCode}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {t(i18n.translationKey.patientName)}
                        </Typography>
                        <Typography fontWeight={600}>{patientExaminationHistory.patientName}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {t(i18n.translationKey.dateOfBirth)}
                        </Typography>
                        <Typography fontWeight={600}>
                            {formatDate(patientExaminationHistory.dob, DATE_TIME_FORMAT["dd/MM/yyyy"])}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {t(i18n.translationKey.phoneNumber)}
                        </Typography>
                        <Typography fontWeight={600}>{patientExaminationHistory.phoneNumber}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={0} sx={{ borderRadius: 3, p: 3, bgcolor: "#f6f7fa" }}>
                <Typography fontWeight={600} mb={2} fontSize={18}>
                    Examination History
                </Typography>
                <AgDataGrid
                    {...agGrid}
                    rowData={patientExaminationHistory.examinationHistory}
                    columnDefs={[
                        {
                            headerName: t(i18n.translationKey.requestNumber),
                            field: "examinationId",
                            cellClass: "ag-cell-center",
                            flex: 1,
                        },
                        {
                            headerName: t(i18n.translationKey.examinationTime),
                            field: "returnTime",
                            cellClass: "ag-cell-center",
                            valueFormatter: (params) => formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]),
                            flex: 1,
                        },
                        {
                            headerName: t(i18n.translationKey.serviceName),
                            field: "serviceName",
                            cellClass: "ag-cell-center",
                            flex: 1.5,
                        },
                        {
                            headerName: t(i18n.translationKey.enteredByDoctor),
                            field: "doctorName",
                            cellClass: "ag-cell-center",
                            flex: 1.5,
                        },
                        {
                            headerName: t(i18n.translationKey.status),
                            field: "status",
                            cellClass: "ag-cell-center",
                            flex: 1,
                            cellRenderer: (params: any) => (
                                <Chip
                                    label={t(params.value)}
                                    size="small"
                                    sx={{
                                        bgcolor: params.value === "COMPLETED" ? "#22c55e" : "#f59e42",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: 13,
                                        px: 1.5,
                                    }}
                                />
                            ),
                        },
                        {
                            cellClass: "ag-cell-center",
                            cellRenderer: (params: CustomCellRendererProps) => (
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        setOpen(true);
                                        setExaminationId(params.data.examinationId);
                                    }}
                                >
                                    <Visibility />
                                </IconButton>
                            ),
                            flex: 0.5,
                        },
                    ]}
                />
            </Paper>
            <ExaminationDetailModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setExaminationId(null);
                }}
                examinationId={examinationId}
            />
        </Box>
    );
};

export default ExaminationPatientHistoryPage;
