import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { Dialog } from "~/components/common/dialog";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { formatDate } from "~/utils/date-time";

const mockExaminationData = {
    services: [
        {
            id: 1,
            name: "Complete Blood Count",
            result: "Normal",
            referenceValue: "4.5-5.5 million cells/mcL",
        },
        {
            id: 2,
            name: "Blood Glucose",
            result: "95 mg/dL",
            referenceValue: "70-100 mg/dL",
        },
        {
            id: 3,
            name: "Blood Pressure",
            result: "120/80 mmHg",
            referenceValue: "< 120/80 mmHg",
        },
        {
            id: 4,
            name: "Heart Rate",
            result: "72 bpm",
            referenceValue: "60-100 bpm",
        },
    ],
    diagnosis: "Patient is in normal condition with all vital signs within acceptable ranges.",
    notes: "No adverse reactions observed. Patient does not report any discomfort or unusual symptoms.",
};

interface ExaminationDetailModalProps {
    open: boolean;
    onClose: () => void;
}
const ExaminationDetailModal: React.FC<ExaminationDetailModalProps> = ({ open, onClose }) => {
    // if (!patient) return null;
    const { t } = useTranslation();
    const agGrid = useAgGrid({});
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
                                    CDCDN250719092256101
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.patientName)}
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {/* {patient.name} */}
                                    John Doe
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.phoneNumber)}
                                </Typography>
                                <Typography variant="body1">
                                    {/* {patient.phone} */}
                                    +1234567890
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.examinationTime)}
                                </Typography>
                                <Typography variant="body1">
                                    {/* {patient.lastExam} */}
                                    {formatDate(new Date(), DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"])}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.serviceName)}
                                </Typography>
                                <Typography variant="body1">
                                    {/* {patient.service} */}
                                    General Checkup
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {t(i18n.translationKey.status)}
                                </Typography>
                                <Chip
                                    // label={patient.status}
                                    // color={patient.status === "Complete" ? "success" : "warning"}
                                    size="small"
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
                        Examination Results
                    </Typography>
                    <AgDataGrid
                        {...agGrid}
                        rowData={mockExaminationData.services}
                        columnDefs={[
                            { headerName: t(i18n.translationKey.serviceName), field: "name" },
                            { headerName: t(i18n.translationKey.result), field: "result" },
                            { headerName: t(i18n.translationKey.referenceValue), field: "referenceValue" },
                        ]}
                    />
                    {/* <TableContainer component={Paper} variant="outlined">
                        <Table aria-label="examination results table">
                            <TableHead>
                                <TableRow
                                    sx={{
                                        bgcolor: "#f5f5f5",
                                    }}
                                >
                                    <TableCell>Service Name</TableCell>
                                    <TableCell>Result</TableCell>
                                    <TableCell>Reference Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mockExaminationData.services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell>{service.name}</TableCell>
                                        <TableCell>{service.result}</TableCell>
                                        <TableCell>{service.referenceValue}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                    <Box
                        sx={{
                            mt: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Diagnosis
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Typography variant="body1">{mockExaminationData.diagnosis}</Typography>
                        </Paper>
                        <Typography variant="h6" gutterBottom>
                            Conclusion
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Typography variant="body1">{mockExaminationData.notes}</Typography>
                        </Paper>
                        <Typography variant="h6" gutterBottom>
                            Notes
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Typography variant="body1">{mockExaminationData.notes}</Typography>
                        </Paper>
                    </Box>
                </Box>
            </Dialog.Body>
        </Dialog>
    );
};
export default ExaminationDetailModal;
