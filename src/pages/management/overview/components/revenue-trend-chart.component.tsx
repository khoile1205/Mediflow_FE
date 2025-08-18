import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Highcharts from "highcharts";
import { Chart as HighchartsReact } from "@highcharts/react";
import { TotalRevenueByYearMonth } from "~/entities";
import i18n from "~/configs/i18n";
import { buildSeries, months } from "~/utils/chartUtils";

interface RevenueTrendChartProps {
    data: TotalRevenueByYearMonth[];
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data }) => {
    const { t } = useTranslation();
    const chartOptions = useMemo(() => {
        if (!data || data.length === 0) {
            return {};
        }

        const series = buildSeries(
            data.map((d) => ({
                year: d.year,
                monthly: d.monthlyRevenues.map((m) => ({
                    ...m,
                    value: m.totalRevenue,
                })),
            })),
            (m) => m.value,
        );

        return {
            chart: {
                type: "line",
                height: 400,
                backgroundColor: "transparent",
            },
            title: {
                text: t(i18n.translationKey.revenueTrendByMonth),
                style: {
                    fontSize: "18px",
                    fontWeight: "bold",
                },
            },
            xAxis: {
                categories: months,
                title: {
                    text: t(i18n.translationKey.month),
                },
            },
            yAxis: {
                title: {
                    text: `${t(i18n.translationKey.revenue)} (VND)`,
                },
                min: 0,
                labels: {
                    format: "{value:,.0f}",
                },
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false,
                    },
                    enableMouseTracking: true,
                    marker: {
                        radius: 4,
                    },
                },
            },
            legend: {
                enabled: true,
                align: "center" as const,
                verticalAlign: "bottom" as const,
            },
            tooltip: {
                shared: true,
                crosshairs: true,
                pointFormat: '{series.name}: <b style="color: {series.color};">{point.y:,.0f} VND</b><br/>',
                headerFormat: `<div style="font-size: 14px; font-weight: bold;">💰 {point.key}</div><br/>`,
            },
            credits: {
                enabled: false,
            },
            series,
        };
    }, [data, t]);

    if (!data || data.length === 0) {
        return (
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6">{t(i18n.translationKey.revenueTrendByMonth)}</Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                        <Typography color="text.secondary">{t(i18n.translationKey.noDataToDisplay)}</Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </CardContent>
        </Card>
    );
};
