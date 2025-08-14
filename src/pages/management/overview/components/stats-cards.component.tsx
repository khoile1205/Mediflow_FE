import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OverviewStats } from "~/entities";
import { formatCurrencyVND } from "~/utils/currency";
import PeopleIcon from "@mui/icons-material/People";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import i18n from "~/configs/i18n";

interface StatsCardsProps {
    data: OverviewStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
    const { t } = useTranslation();

    const statsData = [
        {
            title: t(i18n.translationKey.currentPatients),
            value: data.todayPatientCount.count,
            icon: <PeopleIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            color: "#e3f2fd",
        },
        {
            title: t(i18n.translationKey.todayInjections),
            value: data.todayInjectionCount.count,
            icon: <VaccinesIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
            color: "#e8f5e8",
        },
        {
            title: t(i18n.translationKey.currentRevenue),
            value: formatCurrencyVND(data.todayRevenue.amount),
            icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
            color: "#fff3e0",
        },
        {
            title: t(i18n.translationKey.processedOrders),
            value: data.processedReceptionsCount.count,
            icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: "#7b1fa2" }} />,
            color: "#f3e5f5",
        },
    ];

    return (
        <Box display="flex" gap={3} sx={{ mb: 4, flexWrap: "wrap" }}>
            {statsData.map((stat, index) => (
                <Box key={index} sx={{ flex: "1 1 calc(25% - 18px)", minWidth: "250px" }}>
                    <Card
                        sx={{
                            height: "100%",
                            background: `linear-gradient(135deg, ${stat.color} 0%, #ffffff 100%)`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                                        {typeof stat.value === "string" ? stat.value : stat.value.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.title}
                                    </Typography>
                                </Box>
                                <Box>{stat.icon}</Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    );
};
