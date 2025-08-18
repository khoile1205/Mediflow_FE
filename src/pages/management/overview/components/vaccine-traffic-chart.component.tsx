import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Highcharts from "highcharts";
import { Chart as HighchartsReact } from "@highcharts/react";
import { VaccineTraffic } from "~/entities";
import i18n from "~/configs/i18n";

interface VaccineTrafficChartProps {
    data: VaccineTraffic[];
}

export const VaccineTrafficChart: React.FC<VaccineTrafficChartProps> = ({ data }) => {
    const { t } = useTranslation();
    const chartOptions = useMemo(() => {
        const categories = data.map((vaccine) => vaccine.vaccineName);
        const seriesData = data.map((vaccine) => vaccine.totalUsed);

        return {
            chart: {
                type: "column",
                height: 400,
                backgroundColor: "transparent",
            },
            title: {
                text: t(i18n.translationKey.vaccineTrafficChart),
                style: {
                    fontSize: "18px",
                    fontWeight: "bold",
                },
            },
            xAxis: {
                categories,
                title: {
                    text: t(i18n.translationKey.vaccineType),
                },
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: "12px",
                    },
                },
            },
            yAxis: {
                title: {
                    text: `${t(i18n.translationKey.usedDoses)} (${t(i18n.translationKey.dosesUnit)})`,
                },
                min: 0,
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        format: "{point.y}",
                    },
                    enableMouseTracking: true,
                    colorByPoint: true,
                },
            },
            legend: {
                enabled: false,
            },
            tooltip: {
                headerFormat: '<div style="font-size: 14px; font-weight: bold;">💉 {point.key}</div><br/>',
                pointFormat: `${t(i18n.translationKey.usedDoses)}: <b style="color: {point.color};">{point.y:,.0f}</b> ${t(i18n.translationKey.dosesUnit)}`,
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    type: "column" as const,
                    name: "Lưu lượng vắc xin",
                    data: seriesData,
                    colors: [
                        "#8085e9",
                        "#f15c80",
                        "#e4d354",
                        "#2b908f",
                        "#f45b5b",
                        "#91e8e1",
                        "#434348",
                        "#90ed7d",
                        "#f7a35c",
                        "#8085e9",
                    ],
                },
            ],
        };
    }, [data, t]);

    if (!data || data.length === 0) {
        return (
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6">{t(i18n.translationKey.vaccineTrafficChart)}</Typography>
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
