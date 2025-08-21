import {
    Box,
    Card,
    CardContent,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { THospitalRevenueDailyRevenueStatistic, THospitalRevenueReportResponse } from "~/services/reports/infras";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";

interface HospitalRevenueReportProps {
    data: THospitalRevenueReportResponse;
}

export const HospitalRevenueReport: React.FC<HospitalRevenueReportProps> = ({ data }) => {
    const { t } = useTranslation();

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    {t(i18n.translationKey.hospitalRevenueReport)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t(i18n.translationKey.from)}: <b>{formatDate(data.fromDate, DATE_TIME_FORMAT["dd/MM/yyyy"])}</b>{" "}
                    &nbsp; | &nbsp; {t(i18n.translationKey.to)}:{" "}
                    <b>{formatDate(data.toDate, DATE_TIME_FORMAT["dd/MM/yyyy"])}</b>
                </Typography>
            </Box>

            <Divider />

            {/* Summary */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
                {[
                    { label: t(i18n.translationKey.totalRevenue), value: data.summary.totalRevenue },
                    { label: t(i18n.translationKey.examFeeRevenue), value: data.summary.totalExamFeeRevenue },
                    { label: t(i18n.translationKey.testFeeRevenue), value: data.summary.totalTestFeeRevenue },
                    { label: t(i18n.translationKey.injectionRevenue), value: data.summary.totalInjectionRevenue },
                ].map((item) => (
                    <Card key={item.label} variant="outlined" sx={{ minWidth: 200 }}>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                                {item.label}
                            </Typography>
                            <Typography variant="h6">{formatCurrencyVND(item.value)}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            {/* Daily Revenue Table */}
            <Box>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                    {t(i18n.translationKey.dailyRevenueBreakdown)}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t(i18n.translationKey.transactionDate)}</TableCell>
                                <TableCell align="center">{t(i18n.translationKey.examFee)}</TableCell>
                                <TableCell align="center">{t(i18n.translationKey.testFee)}</TableCell>
                                <TableCell align="center">{t(i18n.translationKey.injectionRevenue)}</TableCell>
                                <TableCell align="center">{t(i18n.translationKey.totalRevenue)}</TableCell>
                                <TableCell align="center">{t(i18n.translationKey.examCount)}</TableCell>
                                <TableCell align="center">{t(i18n.translationKey.testCount)}</TableCell>
                                <TableCell align="center">{t(i18n.translationKey.injectionCount)}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.dailyRevenues?.map((stat: THospitalRevenueDailyRevenueStatistic) => (
                                <TableRow key={stat.date.toString()}>
                                    <TableCell>{formatDate(stat.date, DATE_TIME_FORMAT["dd/MM/yyyy"])}</TableCell>
                                    <TableCell align="right">{formatCurrencyVND(stat.examFeeRevenue)}</TableCell>
                                    <TableCell align="right">{formatCurrencyVND(stat.testFeeRevenue)}</TableCell>
                                    <TableCell align="right">{formatCurrencyVND(stat.injectionRevenue)}</TableCell>
                                    <TableCell align="right">{formatCurrencyVND(stat.totalRevenue)}</TableCell>
                                    <TableCell align="right">{stat.examCount}</TableCell>
                                    <TableCell align="right">{stat.testCount}</TableCell>
                                    <TableCell align="right">{stat.injectionCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Stack>
    );
};
