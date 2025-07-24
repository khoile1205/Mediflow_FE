import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { Dialog } from "~/components/common/dialog";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { useQueryGetExaminationHistoryDetailById } from "~/services/examination/hooks/queries";
import { formatDate } from "~/utils/date-time";

interface ExaminationDetailModalProps {
    open: boolean;
    onClose: () => void;
    examinationId: number;
}
const ExaminationDetailModal: React.FC<ExaminationDetailModalProps> = ({ open, onClose, examinationId }) => {
    // if (!patient) return null;
    const { t } = useTranslation();
    const agGrid = useAgGrid({});
    const {
        data: { examinationHistory },
    } = useQueryGetExaminationHistoryDetailById(examinationId);

    if (!examinationHistory) return null;

    return (
        <Dialog open={open} onClose={onClose}>
            <Dialog.Header title={t(i18n.translationKey.examinationDetails)} onClose={onClose} />
            <Dialog.Body>
                <Box
                    sx={{
                        p: 1,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: "#f8f9fa",
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.medicalCode)}
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {/* {patient.id} */}
                                    {examinationHistory.patientCode}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.patientName)}
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {/* {patient.name} */}
                                    {examinationHistory.patientName}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.phoneNumber)}
                                </Typography>
                                <Typography variant="body1">
                                    {/* {patient.phone} */}
                                    {examinationHistory.patientPhoneNumber}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.examinationTime)}
                                </Typography>
                                <Typography variant="body1">
                                    {/* {patient.lastExam} */}
                                    {formatDate(examinationHistory.returnDate, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"])}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.serviceName)}
                                </Typography>
                                <Typography variant="body1">
                                    {/* {patient.service} */}
                                    {examinationHistory.serviceName}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.status)}
                                </Typography>
                                <Chip
                                    label={t(examinationHistory.status)}
                                    color={examinationHistory.status === "Completed" ? "warning" : "success"}
                                    size="small"
                                    sx={{
                                        bgcolor: examinationHistory.status === "Completed" ? "#f59e42" : "#22c55e",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: 13,
                                        px: 1.5,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            mt: 2,
                        }}
                    >
                        {t(i18n.translationKey.examinationResults)}
                    </Typography>
                    <AgDataGrid
                        {...agGrid}
                        rowData={examinationHistory.examinationTestParameters}
                        columnDefs={[
                            {
                                headerName: t(i18n.translationKey.serviceName),
                                field: "parameterName",
                                flex: 1,
                                cellClass: "ag-cell-center",
                            },
                            {
                                headerName: t(i18n.translationKey.result),
                                field: "result",
                                flex: 0.5,
                                cellClass: "ag-cell-center",
                            },
                            {
                                headerName: t(i18n.translationKey.referenceValue),
                                field: "standardValue",
                                flex: 0.5,
                                cellClass: "ag-cell-center",
                            },
                        ]}
                    />
                    <Box
                        sx={{
                            mt: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            {t(i18n.translationKey.diagnose)}
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Typography variant="body1">{examinationHistory.diagnosis}</Typography>
                        </Paper>
                        <Typography variant="h6" gutterBottom>
                            {t(i18n.translationKey.conclusion)}
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Typography variant="body1">{examinationHistory.conclusion}</Typography>
                        </Paper>
                        <Typography variant="h6" gutterBottom>
                            {t(i18n.translationKey.note)}
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Typography variant="body1">{examinationHistory.note}</Typography>
                        </Paper>
                    </Box>
                </Box>
            </Dialog.Body>
        </Dialog>
    );
};
export default ExaminationDetailModal;
