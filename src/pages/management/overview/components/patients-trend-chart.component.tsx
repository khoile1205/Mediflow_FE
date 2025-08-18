import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Highcharts from "highcharts";
import { Chart as HighchartsReact } from "@highcharts/react";
import { TotalPatientsByYearMonth } from "~/entities";
import i18n from "~/configs/i18n";
import { buildSeries, months } from "~/utils/chartUtils";

interface PatientsTrendChartProps {
    data: TotalPatientsByYearMonth[];
}

export const PatientsTrendChart: React.FC<PatientsTrendChartProps> = ({ data }) => {
    const { t } = useTranslation();
    const chartOptions = useMemo(() => {
        if (!data || data.length === 0) {
            return {};
        }

        const series = buildSeries(
            data.map((d) => ({
                year: d.year,
                monthly: d.monthlyPatients.map((m) => ({
                    ...m,
                    value: m.totalPatients,
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
                text: t(i18n.translationKey.patientsTrendByMonth),
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
                    text: `${t(i18n.translationKey.patient)}`,
                },
                min: 0,
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false,
                    },
                    marker: {
                        enabled: true,
                        radius: 4,
                    },
                },
            },
            tooltip: {
                shared: true,
                crosshairs: true,
                pointFormat: `{series.name}: <b style="color: {series.color};">{point.y:,.0f}</b> ${t(i18n.translationKey.patientsUnit)}<br/>`,
                headerFormat: `<div style="font-size: 14px; font-weight: bold;">📅 {point.key}</div><br/>`,
            },
            legend: {
                enabled: true,
                align: "center" as const,
                verticalAlign: "bottom" as const,
            },
            series: series,
            credits: {
                enabled: false,
            },
        };
    }, [data, t]);

    if (!data || data.length === 0) {
        return (
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {t(i18n.translationKey.patientsTrendByMonth)}
                    </Typography>
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
                <Box sx={{ mt: 2 }}>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </Box>
            </CardContent>
        </Card>
    );
};
