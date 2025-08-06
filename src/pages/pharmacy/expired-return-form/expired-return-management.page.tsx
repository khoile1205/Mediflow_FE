import { Visibility } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { ICellRendererParams, RowDoubleClickedEvent } from "ag-grid-community";
import { ColDef } from "node_modules/ag-grid-community/dist/types/src/entities/colDef";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { MedicineBatchExpiredFormStatus } from "~/constants/enums";
import { MedicineBatchExpiredReturn } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryGetListMedicineBatchReturnForm } from "~/services/inventory/hooks/queries";
import { formatDate } from "~/utils/date-time";
import { ExpiredReturnStatus } from "./components/ExpiredFormStatusLabel";
import { ExpiredReturnDetailModal } from "./expired-return-form-detail.modal";

const ExpiredReturnManagementPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [status, setStatus] = React.useState<MedicineBatchExpiredFormStatus | null>(null);
    const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);
    const [selectedReturnId, setSelectedReturnId] = React.useState<number | null>(null);

    const expiredReturnAgGrid = useAgGrid<MedicineBatchExpiredReturn>({});

    const columnDefs: ColDef<MedicineBatchExpiredReturn>[] = [
        {
            field: "returnCode",
            headerName: t(i18n.translationKey.returnCode),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            field: "receiverName",
            headerName: t(i18n.translationKey.contactPerson),
            flex: 1,
            cellClass: "ag-cell-center",
        },
        {
            field: "receiverPhone",
            headerName: t(i18n.translationKey.phoneNumber),
            flex: 1,
            cellClass: "ag-cell-center",
        },
        {
            field: "receiverEmail",
            headerName: t(i18n.translationKey.email),
            flex: 1,
            cellClass: "ag-cell-center",
        },
        {
            field: "status",
            headerName: t(i18n.translationKey.status),
            flex: 1,
            cellClass: "ag-cell-center",
            cellRenderer: (params: ICellRendererParams<MedicineBatchExpiredReturn>) => (
                <ExpiredReturnStatus status={params.data.status} />
            ),
        },
        {
            field: "createdAt",
            headerName: t(i18n.translationKey.createdAt),
            flex: 1,
            cellClass: "ag-cell-center",
            valueFormatter: (params) => formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]),
        },
        {
            cellRenderer: (params: ICellRendererParams<MedicineBatchExpiredReturn>) => (
                <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title={t(i18n.translationKey.view)}>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setSelectedReturnId(params.data.id);
                                setOpenDetailModal(true);
                            }}
                        >
                            <Visibility />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
            cellClass: "ag-cell-center",
            flex: 0.5,
        },
    ];

    const { pageSize, handlePageChange, pageIndex } = usePagination();

    const {
        data: { medicineBatchReturnForms, totalItems },
    } = useQueryGetListMedicineBatchReturnForm({
        pageIndex,
        pageSize,
        searchTerm,
        status,
    });

    const handleRowDoubleClicked = (params: RowDoubleClickedEvent<MedicineBatchExpiredReturn>) => {
        setSelectedReturnId(params.data.id);
        setOpenDetailModal(true);
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
                    {t(i18n.translationKey.expiredReturnManagement)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t(i18n.translationKey.expiredReturnManagementDescription)}
                </Typography>

                <Paper sx={{ my: 3 }}>
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Stack direction="row" spacing={2} className="pe-3">
                            <Button
                                variant={status === null ? "contained" : "outlined"}
                                color="secondary"
                                onClick={() => setStatus(null)}
                            >
                                {t(i18n.translationKey.all)}
                            </Button>
                            <Button
                                variant={status === MedicineBatchExpiredFormStatus.PENDING ? "contained" : "outlined"}
                                color="inherit"
                                onClick={() => setStatus(MedicineBatchExpiredFormStatus.PENDING)}
                            >
                                {t(i18n.translationKey.pending)}
                            </Button>
                            <Button
                                variant={status === MedicineBatchExpiredFormStatus.APPROVED ? "contained" : "outlined"}
                                color="primary"
                                onClick={() => setStatus(MedicineBatchExpiredFormStatus.APPROVED)}
                            >
                                {t(i18n.translationKey.approved)}
                            </Button>
                            <Button
                                variant={status === MedicineBatchExpiredFormStatus.REJECTED ? "contained" : "outlined"}
                                color="error"
                                onClick={() => setStatus(MedicineBatchExpiredFormStatus.REJECTED)}
                            >
                                {t(i18n.translationKey.rejected)}
                            </Button>
                        </Stack>
                        <SearchBox
                            onChange={(value) => setSearchTerm(value)}
                            placeholder={t(i18n.translationKey.searchReturnForm)}
                            fullWidth
                            className="basis-1/3"
                        />
                    </Box>
                </Paper>

                <AgDataGrid
                    {...expiredReturnAgGrid}
                    rowData={medicineBatchReturnForms}
                    columnDefs={columnDefs}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    pagination
                    pageIndex={pageIndex}
                    onPageChange={handlePageChange}
                    onRowDoubleClicked={handleRowDoubleClicked}
                />
            </Box>

            <ExpiredReturnDetailModal
                open={openDetailModal}
                onClose={() => {
                    setSelectedReturnId(null);
                    setOpenDetailModal(false);
                }}
                expiredReturnId={selectedReturnId}
            />
        </Box>
    );
};

export default ExpiredReturnManagementPage;
