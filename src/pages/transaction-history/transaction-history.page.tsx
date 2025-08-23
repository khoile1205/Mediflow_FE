import { Box, Button, Grid, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { ColDef, ICellRendererParams, RowDoubleClickedEvent } from "ag-grid-community";
import { t } from "i18next";
import React from "react";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { Transaction } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryGetTransactionHistory } from "~/services/transaction-history/queries";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";
import TransactionHistoryDetailModal from "./transaction-history.detail.modal";
import { TransactionHistoryFilterForm } from "./types";
import { getPaymentMethod } from "./utils";

const TransactionHistoryPage: React.FC = () => {
    const { handlePageChange, pageIndex, pageSize } = usePagination();
    const transactionHistoryAgGrid = useAgGrid({});

    const transactionFilterForm = useForm<TransactionHistoryFilterForm>({
        defaultValues: {
            toDate: null,
            fromDate: null,
            searchTerm: "",
        },
    });

    const [searchParams, setSearchParams] = React.useState<{
        fromDate?: Date | null;
        toDate?: Date | null;
        searchTerm?: string;
        pageIndex?: number;
        pageSize?: number;
    }>({
        fromDate: null,
        toDate: null,
        searchTerm: "",
        pageIndex,
        pageSize,
    });
    const {
        data: { totalItems, transactions },
        isLoading,
    } = useQueryGetTransactionHistory(searchParams);

    const handleSearch = (data: TransactionHistoryFilterForm) => {
        // const formValues = transactionFilterForm.getValues();
        setSearchParams({
            toDate: data.toDate,
            fromDate: data.fromDate,
            searchTerm: data.searchTerm,
            pageIndex,
            pageSize,
        });
    };

    const [selectedTransactionId, setSelectedTransactionId] = React.useState<number>(null);

    const columnDefs: ColDef<Transaction>[] = React.useMemo(
        () =>
            [
                {
                    headerName: t(i18n.translationKey.invoiceNumber),
                    field: "payment.invoiceNumber",
                    flex: 1,
                },
                {
                    headerName: t(i18n.translationKey.patientName),
                    field: "patient.name",
                    cellClass: "ag-cell-center",
                    flex: 1,
                },
                {
                    headerName: t(i18n.translationKey.totalAmount),
                    field: "payment.totalAmount",
                    cellClass: "ag-cell-center",
                    valueFormatter: ({ value }) => formatCurrencyVND(value),
                    flex: 1,
                },
                {
                    headerName: t(i18n.translationKey.paymentMethod),
                    field: "payment.method",
                    cellClass: "ag-cell-center",

                    flex: 1,
                    valueGetter: (params) => {
                        return getPaymentMethod(params.data.payment.method);
                    },
                },
                {
                    headerName: t(i18n.translationKey.transactionDate),
                    field: "payment.createdAt",
                    flex: 1,
                    cellClass: "ag-cell-center",
                    valueFormatter: (params) => {
                        return formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]);
                    },
                },
                {
                    cellRenderer: (params: ICellRendererParams<Transaction>) => (
                        <Tooltip title={t(i18n.translationKey.view)}>
                            <Button
                                size="small"
                                onClick={() => {
                                    setSelectedTransactionId(params.data.payment.id);
                                }}
                            >
                                {t(i18n.translationKey.viewDetail)}
                            </Button>
                        </Tooltip>
                    ),
                    cellClass: "text-center",
                },
            ] as ColDef<Transaction>[],
        [t],
    );

    const handleRowDoubleClicked = (event: RowDoubleClickedEvent<Transaction>) => {
        setSelectedTransactionId(event.data.payment.id);
    };

    return (
        <Box>
            <Box
                component="main"
                sx={{
                    p: 3,
                    mt: { xs: 8, lg: 0 },
                }}
            >
                <Typography variant="h5" fontWeight="600" color="text.primary" gutterBottom>
                    {t(i18n.translationKey.transactionHistory)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t(i18n.translationKey.transactionHistoryDescription)}
                </Typography>

                <DynamicForm form={transactionFilterForm}>
                    <Paper sx={{ my: 3, px: 3, pt: 2 }}>
                        <Grid container spacing={3} alignItems="center">
                            {/* Date Range */}
                            <Grid size={{ xs: 12, md: 5 }} mb={2}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    {t(i18n.translationKey.dateRange)}
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <FormItem
                                        render="date-picker"
                                        name="fromDate"
                                        label={t(i18n.translationKey.fromDate)}
                                        required
                                        placeholder={t(i18n.translationKey.fromDate)}
                                        maxDate={transactionFilterForm.watch("toDate")}
                                        fullWidth
                                    />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {t(i18n.translationKey.to)}
                                    </Typography>
                                    <FormItem
                                        render="date-picker"
                                        name="toDate"
                                        label={t(i18n.translationKey.toDate)}
                                        required
                                        placeholder={t(i18n.translationKey.toDate)}
                                        minDate={transactionFilterForm.watch("fromDate")}
                                        fullWidth
                                    />
                                </Stack>
                            </Grid>

                            {/* Search Keyword */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    {t(i18n.translationKey.searchKeyword)}
                                </Typography>
                                <FormItem
                                    render="text-input"
                                    name="searchTerm"
                                    fullWidth
                                    placeholder={t(i18n.translationKey.transactionHistorySearchPlaceholder)}
                                />
                            </Grid>

                            {/* Actions */}
                            <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => transactionFilterForm.reset()}
                                >
                                    {t(i18n.translationKey.reset)}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={transactionFilterForm.handleSubmit(handleSearch)}
                                >
                                    {t(i18n.translationKey.search)}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </DynamicForm>

                <AgDataGrid
                    {...transactionHistoryAgGrid}
                    rowData={transactions}
                    columnDefs={columnDefs}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    pagination
                    pageIndex={pageIndex}
                    loading={isLoading}
                    onPageChange={handlePageChange}
                    onRowDoubleClicked={handleRowDoubleClicked}
                />

                <TransactionHistoryDetailModal
                    open={Boolean(selectedTransactionId)}
                    onClose={() => setSelectedTransactionId(undefined)}
                    transactionId={selectedTransactionId}
                />
            </Box>
        </Box>
    );
};

export default TransactionHistoryPage;
