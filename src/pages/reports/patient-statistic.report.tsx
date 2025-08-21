import {
    Stack,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Divider,
    Box,
    Card,
    CardContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import {
    TPatientStatisticResponse,
    TPatientStatisticAgeGroupReportStatistic,
    TPatientStatisticLocationReportStatistic,
} from "~/services/reports/infras";
import { formatDate } from "~/utils/date-time";

interface PatientStatisticReportProps {
    data: TPatientStatisticResponse;
}

export const PatientStatisticReport: React.FC<PatientStatisticReportProps> = ({ data }) => {
    const { t } = useTranslation();

    return (
        <Stack spacing={3}>
            {/* Report Header */}
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    {t(i18n.translationKey.patientStatisticsReport)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t(i18n.translationKey.from)}: <b>{formatDate(data.fromDate, DATE_TIME_FORMAT["dd/MM/yyyy"])}</b>{" "}
                    &nbsp; | &nbsp; {t(i18n.translationKey.to)}:{" "}
                    <b>{formatDate(data.toDate, DATE_TIME_FORMAT["dd/MM/yyyy"])}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t(i18n.translationKey.generatedAt)}: {formatDate(data.generatedAt, DATE_TIME_FORMAT["dd/MM/yyyy"])}{" "}
                    | {t(i18n.translationKey.generatedBy)}: {data.generatedBy}
                </Typography>
            </Box>

            <Divider />

            {/* Summary Section */}
            <Stack direction="row" spacing={2}>
                <Card variant="outlined" sx={{ minWidth: 200 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t(i18n.translationKey.totalPatients)}
                        </Typography>
                        <Typography variant="h6">{data.summary.totalPatients}</Typography>
                    </CardContent>
                </Card>
            </Stack>

            {/* Age Group Table */}
            <Box>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                    {t(i18n.translationKey.statisticsByAgeGroup)}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t(i18n.translationKey.ageGroup)}</TableCell>
                                <TableCell>{t(i18n.translationKey.ageRange)}</TableCell>
                                <TableCell align="right">{t(i18n.translationKey.patientCount)}</TableCell>
                                <TableCell align="right">{t(i18n.translationKey.percentage)}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.ageGroupStatistics?.map((stat: TPatientStatisticAgeGroupReportStatistic) => (
                                <TableRow key={stat.ageGroup}>
                                    <TableCell>{stat.ageGroup}</TableCell>
                                    <TableCell>{stat.ageRange}</TableCell>
                                    <TableCell align="right">{stat.patientCount}</TableCell>
                                    <TableCell align="right">{stat.percentage.toFixed(2)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Location Table */}
            <Box>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                    {t(i18n.translationKey.statisticsByLocation)}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t(i18n.translationKey.stt)}</TableCell>
                                <TableCell>{t(i18n.translationKey.province)}</TableCell>
                                <TableCell align="right">{t(i18n.translationKey.patientCount)}</TableCell>
                                <TableCell align="right">{t(i18n.translationKey.percentage)}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.locationStatistics?.map((stat: TPatientStatisticLocationReportStatistic) => (
                                <TableRow key={stat.stt}>
                                    <TableCell>{stat.stt}</TableCell>
                                    <TableCell>{stat.province}</TableCell>
                                    <TableCell align="right">{stat.patientCount}</TableCell>
                                    <TableCell align="right">{stat.percentage.toFixed(2)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Stack>
    );
};
