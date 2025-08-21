import { Card, CardHeader, Divider, Stack, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { TMedicineRevenueResponse } from "~/services/reports/infras";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";

interface MedicineRevenueReportProps {
    data: TMedicineRevenueResponse;
}

export const MedicineRevenueReport: React.FC<MedicineRevenueReportProps> = ({ data }) => {
    const { t } = useTranslation();

    // Pagination state for medicine details
    const [medicinePageIndex, setMedicinePageIndex] = useState(1);
    const [medicinePageSize, setMedicinePageSize] = useState(10);

    // Pagination state for batch details
    const [batchPageIndex, setBatchPageIndex] = useState(1);
    const [batchPageSize, setBatchPageSize] = useState(10);

    const medicineDetailAgGrid = useAgGrid({});
    const batchDetailAgGrid = useAgGrid({});
    const categoryAgGrid = useAgGrid({});
    const dailyAgGrid = useAgGrid({});

    const medicineDetails = React.useMemo(() => {
        return data.medicineDetails || [];
    }, [data.medicineDetails]);

    const batchDetails = React.useMemo(() => {
        return data.batchDetails || [];
    }, [data.batchDetails]);

    // Paginated data
    const paginatedMedicineDetails = useMemo(() => {
        const start = (medicinePageIndex - 1) * medicinePageSize;
        return medicineDetails.slice(start, start + medicinePageSize);
    }, [medicineDetails, medicinePageIndex, medicinePageSize]);

    const paginatedBatchDetails = useMemo(() => {
        const start = (batchPageIndex - 1) * batchPageSize;
        return batchDetails.slice(start, start + batchPageSize);
    }, [batchDetails, batchPageIndex, batchPageSize]);

    // Column definitions

    return (
        <Stack spacing={3}>
            {/* Summary Section */}
            <Card>
                <CardHeader title={t(i18n.translationKey.medicineRevenueReport)} />
                <Divider />
                <Stack spacing={1} p={2}>
                    <Typography>
                        <b>{t(i18n.translationKey.totalRevenueColon)}</b> {formatCurrencyVND(data.summary.totalRevenue)}
                    </Typography>
                    <Typography>
                        <b>{t(i18n.translationKey.totalQuantityUsed)}:</b> {data.summary.totalQuantityUsed}
                    </Typography>
                    <Typography>
                        <b>{t(i18n.translationKey.totalMedicineTypes)}:</b> {data.summary.totalMedicineTypes}
                    </Typography>
                    <Typography>
                        <b>{t(i18n.translationKey.from)}:</b>{" "}
                        {formatDate(data.fromDate, DATE_TIME_FORMAT["dd/MM/yyyy"])} <b>{t(i18n.translationKey.to)}:</b>{" "}
                        {formatDate(data.toDate, DATE_TIME_FORMAT["dd/MM/yyyy"])}
                    </Typography>
                </Stack>
            </Card>

            {/* Medicine Details Table */}
            <Card>
                <CardHeader title={t(i18n.translationKey.medicineDetails)} />
                <Divider />
                <AgDataGrid
                    columnDefs={[
                        {
                            headerName: t(i18n.translationKey.stt),
                            field: "stt",
                            width: 80,
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.medicineCode),
                            field: "medicineCode",
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.medicineName),
                            field: "medicineName",
                            cellClass: "ag-cell-center",
                        },
                        { headerName: t(i18n.translationKey.unit), field: "unit", cellClass: "ag-cell-center" },
                        {
                            headerName: t(i18n.translationKey.classification),
                            field: "classification",
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.quantityUsed),
                            field: "quantityUsed",
                            cellClass: "ag-cell-center",
                            width: 150,
                        },
                        {
                            headerName: t(i18n.translationKey.averageUnitPrice),
                            field: "averageUnitPrice",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        {
                            headerName: t(i18n.translationKey.totalRevenue),
                            field: "totalRevenue",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        {
                            headerName: t(i18n.translationKey.averageCostPrice),
                            field: "averageCostPrice",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        { headerName: t(i18n.translationKey.supplier), field: "supplierName" },
                        {
                            headerName: t(i18n.translationKey.estimatedProfit),
                            field: "estimatedProfit",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        {
                            headerName: t(i18n.translationKey.profitMargin),
                            field: "profitMargin",
                            type: "rightAligned",
                            valueFormatter: (params) => `${params.value.toFixed(2)}%`,
                        },
                    ]}
                    rowData={paginatedMedicineDetails}
                    totalItems={medicineDetails.length}
                    pageIndex={medicinePageIndex}
                    pageSize={medicinePageSize}
                    onPageChange={(page, size) => {
                        setMedicinePageIndex(page);
                        setMedicinePageSize(size);
                    }}
                    pagination
                    {...medicineDetailAgGrid}
                />
            </Card>

            {/* Category Statistics Table */}
            <Card>
                <CardHeader title={t(i18n.translationKey.categoryStatistics)} />
                <Divider />
                <AgDataGrid
                    columnDefs={[
                        { headerName: t(i18n.translationKey.category), field: "category" },
                        { headerName: t(i18n.translationKey.quantity), field: "quantity", type: "rightAligned" },
                        {
                            headerName: t(i18n.translationKey.totalRevenue),
                            field: "revenue",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        {
                            headerName: t(i18n.translationKey.percentage),
                            field: "percentage",
                            type: "rightAligned",
                            valueFormatter: (params) => `${params.value.toFixed(2)}%`,
                        },
                        {
                            headerName: t(i18n.translationKey.estimatedProfit),
                            field: "estimatedProfit",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        {
                            headerName: t(i18n.translationKey.profitMargin),
                            field: "profitMargin",
                            type: "rightAligned",
                            valueFormatter: (params) => `${params.value.toFixed(2)}%`,
                        },
                    ]}
                    rowData={data.categoryStatistics || []}
                    {...categoryAgGrid}
                />
            </Card>

            {/* Daily Statistics Table */}
            <Card>
                <CardHeader title={t(i18n.translationKey.dailyStatistics)} />
                <Divider />
                <AgDataGrid
                    columnDefs={[
                        {
                            headerName: t(i18n.translationKey.transactionDate),
                            field: "date",
                            flex: 1,
                            valueFormatter: (params) => formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                        },
                        {
                            headerName: t(i18n.translationKey.quantityUsed),
                            field: "quantityUsed",
                            type: "rightAligned",
                            flex: 1,
                        },
                        {
                            headerName: t(i18n.translationKey.totalRevenue),
                            field: "revenue",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                            flex: 1,
                        },
                        {
                            headerName: t(i18n.translationKey.medicineTypeCount),
                            field: "medicineTypeCount",
                            type: "rightAligned",
                            flex: 1,
                        },
                    ]}
                    rowData={data.dailyStatistics || []}
                    {...dailyAgGrid}
                />
            </Card>

            {/* Batch Details Table */}
            <Card>
                <CardHeader title={t(i18n.translationKey.batchDetails)} />
                <Divider />
                <AgDataGrid
                    columnDefs={[
                        { headerName: t(i18n.translationKey.medicineName), field: "medicineName" },
                        { headerName: t(i18n.translationKey.medicineCode), field: "medicineCode" },
                        { headerName: t(i18n.translationKey.batchNumber), field: "batchNumber" },
                        { headerName: t(i18n.translationKey.expiryDate), field: "expiryDate" },
                        {
                            headerName: t(i18n.translationKey.quantityUsed),
                            field: "quantityUsed",
                            type: "rightAligned",
                        },
                        {
                            headerName: t(i18n.translationKey.importPrice),
                            field: "importPrice",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        {
                            headerName: t(i18n.translationKey.sellingPrice),
                            field: "sellingPrice",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        {
                            headerName: t(i18n.translationKey.totalRevenue),
                            field: "revenue",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                        {
                            headerName: t(i18n.translationKey.profit),
                            field: "profit",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                        },
                    ]}
                    rowData={paginatedBatchDetails}
                    totalItems={batchDetails.length}
                    pageIndex={batchPageIndex}
                    pageSize={batchPageSize}
                    onPageChange={(page, size) => {
                        setBatchPageIndex(page);
                        setBatchPageSize(size);
                    }}
                    pagination
                    {...batchDetailAgGrid}
                />
            </Card>
        </Stack>
    );
};
