import {
    Card,
    CardContent,
    CardHeader,
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
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { TSupplyInventoryResponse } from "~/services/reports/infras";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";

interface InventoryStatisticReportProps {
    data: TSupplyInventoryResponse;
}

export const InventoryStatisticReport: React.FC<InventoryStatisticReportProps> = ({ data }) => {
    const { t } = useTranslation();

    // Frontend pagination states
    const [pageIndex, setPageIndex] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    const agGrid = useAgGrid({});

    const transactions = React.useMemo(() => {
        return data.transactions || [];
    }, [data.transactions]);

    // Slice data for current page
    const paginatedTransactions = React.useMemo(() => {
        const start = (pageIndex - 1) * pageSize;
        return transactions.slice(start, start + pageSize);
    }, [transactions, pageIndex, pageSize]);

    return (
        <Stack spacing={3}>
            {/* Report Title */}
            <Typography variant="h5" color="primary" fontWeight="bold">
                {t(i18n.translationKey.inventoryStatisticsReport)}
            </Typography>

            {/* Summary Card */}
            <Card>
                <CardHeader title={t(i18n.translationKey.summary)} />
                <CardContent>
                    <Stack spacing={1}>
                        <Typography>
                            <b>{t(i18n.translationKey.totalVaccineTypes)}:</b> {data.summary.totalVaccineTypes}
                        </Typography>
                        <Typography>
                            <b>{t(i18n.translationKey.totalQuantityInStock)}:</b> {data.summary.totalQuantityInStock}
                        </Typography>
                        <Typography>
                            <b>{t(i18n.translationKey.totalValue)}:</b>{" "}
                            {formatCurrencyVND(data.summary.totalInventoryValue)}
                        </Typography>
                        <Typography>
                            <b>{t(i18n.translationKey.totalBatches)}:</b> {data.summary.totalBatches}
                        </Typography>
                        <Typography>
                            <b>{t(i18n.translationKey.batchesNearExpiry)}:</b> {data.summary.batchesNearExpiry}
                        </Typography>
                        <Typography>
                            <b>{t(i18n.translationKey.lowStockVaccines)}:</b> {data.summary.lowStockVaccines}
                        </Typography>
                        <Typography>
                            <b>{t(i18n.translationKey.period)}:</b>{" "}
                            {formatDate(data.fromDate, DATE_TIME_FORMAT["dd/MM/yyyy"])} -{" "}
                            {formatDate(data.toDate, DATE_TIME_FORMAT["dd/MM/yyyy"])}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>

            {/* Vaccine Stock Table */}
            <Card>
                <CardHeader title={t(i18n.translationKey.vaccineStockDetails)} />
                <Divider />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {[
                                    { key: "stt", label: t(i18n.translationKey.stt) },
                                    { key: "vaccineCode", label: t(i18n.translationKey.vaccineCode) },
                                    { key: "vaccineName", label: t(i18n.translationKey.vaccineName) },
                                    { key: "unit", label: t(i18n.translationKey.unit) },
                                    { key: "classification", label: t(i18n.translationKey.classification) },
                                    { key: "totalQuantity", label: t(i18n.translationKey.totalQuantity) },
                                    { key: "averageUnitPrice", label: t(i18n.translationKey.averageUnitPrice) },
                                    { key: "totalValue", label: t(i18n.translationKey.totalValue) },
                                    { key: "batchCount", label: t(i18n.translationKey.batchCount) },
                                ].map((col) => (
                                    <TableCell align="center" key={col.key} sx={{ fontWeight: "bold" }}>
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.vaccineStocks?.map((stat) => (
                                <TableRow key={stat.stt} hover>
                                    <TableCell align="center">{stat.stt}</TableCell>
                                    <TableCell align="center">{stat.vaccineCode}</TableCell>
                                    <TableCell align="center">{stat.vaccineName}</TableCell>
                                    <TableCell align="center">{stat.unit}</TableCell>
                                    <TableCell align="center">{stat.classification}</TableCell>
                                    <TableCell align="right">{stat.totalQuantity}</TableCell>
                                    <TableCell align="right">{formatCurrencyVND(stat.averageUnitPrice)}</TableCell>
                                    <TableCell align="right">{formatCurrencyVND(stat.totalValue)}</TableCell>
                                    <TableCell align="center">{stat.batchCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Transactions Section */}
            <Card>
                <CardHeader title={t(i18n.translationKey.transactions)} />
                <Divider />
                <AgDataGrid
                    columnDefs={[
                        { headerName: t(i18n.translationKey.stt), field: "stt", width: 80 },
                        {
                            headerName: t(i18n.translationKey.transactionDate),
                            field: "transactionDate",
                            width: 180,
                            valueFormatter: (params) => formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]),
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.transactionType),
                            field: "transactionType",
                            width: 150,
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.vaccineCode),
                            field: "vaccineCode",
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.vaccineName),
                            field: "vaccineName",
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.batchNumber),
                            field: "batchNumber",
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.quantity),
                            field: "quantity",
                            type: "rightAligned",
                            width: 100,
                            cellClass: "ag-cell-center",
                        },
                        {
                            headerName: t(i18n.translationKey.unitPrice),
                            field: "unitPrice",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                            width: 150,
                        },
                        {
                            headerName: t(i18n.translationKey.totalValue),
                            field: "totalValue",
                            type: "rightAligned",
                            valueFormatter: (params) => formatCurrencyVND(params.value),
                            width: 150,
                        },
                        { headerName: t(i18n.translationKey.description), field: "description" },
                    ]}
                    rowData={paginatedTransactions}
                    totalItems={transactions.length}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onPageChange={(newPageIndex, newPageSize) => {
                        setPageIndex(newPageIndex);
                        setPageSize(newPageSize);
                    }}
                    pagination
                    {...agGrid}
                />
            </Card>
        </Stack>
    );
};
