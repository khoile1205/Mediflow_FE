import React from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { useDocumentTitle } from "~/hooks";
import { useQueryOverview } from "~/services/management/statistic/hooks/queries";
import { StatsCards, PatientsTrendChart, VaccineTrafficChart, RevenueTrendChart } from "./components";

export const OverviewManagement: React.FC = () => {
    const { t } = useTranslation();

    // Set document title
    useDocumentTitle(t(i18n.translationKey.overview));

    const {
        data: { statisticOverview },
        isLoading,
    } = useQueryOverview();

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!statisticOverview) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {t(i18n.translationKey.overview)}
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                {t(i18n.translationKey.overview)}
            </Typography>

            {/* Row 1: Stats Cards */}
            <StatsCards data={statisticOverview} />

            {/* Row 2: Patient trend chart */}
            <PatientsTrendChart data={statisticOverview.totalPatientsByYearMonth} />

            {/* Row 3: Vaccine traffic chart */}
            <VaccineTrafficChart data={statisticOverview.vaccineTraffic} />

            {/* Row 4: Revenue trend chart */}
            <RevenueTrendChart data={statisticOverview.totalRevenueByYearMonth} />
        </Container>
    );
};
