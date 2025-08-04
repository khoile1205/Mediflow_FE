import { Box, Button, Paper, Typography } from "@mui/material";
import { RowSelectedEvent } from "ag-grid-community";
import { ColDef } from "node_modules/ag-grid-community/dist/types/src/entities/colDef";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import i18n from "~/configs/i18n";
import SearchBox from "~/components/common/search-box";
import { MedicineBatch } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryGetExpiredMedicineBatchBatch } from "~/services/inventory/hooks/queries";
import { CreateExpiredReturnModal } from "../expired-return-form";

const NearlyExpiredMedicineBatchPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchExpiredMedicineTerm, setSearchExpiredMedicineTerm] = React.useState<string>("");
    const [openReturnModal, setOpenReturnModal] = React.useState<boolean>(false);
    const [selectedMedicineBatchs, setSelectedMedicineBatchs] = React.useState<MedicineBatch[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = React.useState<number | null>(null);

    const expiredMedicineAgGrid = useAgGrid<MedicineBatch>({
        rowSelection: "multiple",
        isRowSelectable: (row) => {
            return !selectedSupplierId || row.supplierId === selectedSupplierId;
        },
    });

    const columnDefs: ColDef<MedicineBatch>[] = [
        {
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: true,
            resizable: false,
        },
        {
            field: "batchNumber",
            headerName: t(i18n.translationKey.batchNumber),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            field: "medicineCode",
            headerName: t(i18n.translationKey.medicineCode),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            field: "medicineName",
            headerName: t(i18n.translationKey.medicineName),
            cellClass: "ag-cell-center",

            flex: 1,
        },
        {
            field: "supplierName",
            headerName: t(i18n.translationKey.supplierName),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            field: "medicineName",
            headerName: t(i18n.translationKey.medicineName),
            cellClass: "ag-cell-center",

            flex: 1,
        },
        {
            field: "expiryDate",
            headerName: t(i18n.translationKey.expiryDate),
            cellClass: "ag-cell-center",
            flex: 0.8,
        },
        {
            field: "currentQuantity",
            headerName: t(i18n.translationKey.quantity),
            cellClass: "ag-cell-center",
            flex: 1,
        },
    ];

    const { pageSize, handlePageChange, pageIndex } = usePagination();

    const {
        data: { listMedicineBatches, totalItems: totalMedicineBatchesItems },
    } = useQueryGetExpiredMedicineBatchBatch({ pageIndex, pageSize, searchTerm: searchExpiredMedicineTerm });

    const handleRowSelected = (params: RowSelectedEvent<MedicineBatch>) => {
        const node = params.node;
        const rowData = node.data;

        if (params.node.isSelected()) {
            // If there's already a selected supplier and it doesn't match, deselect this row
            if (selectedSupplierId && rowData.supplierId !== selectedSupplierId) {
                node.setSelected(false);
                return;
            }

            // If this is the first selection, lock the supplierId
            if (!selectedSupplierId) {
                setSelectedSupplierId(rowData.supplierId);
            }
        }

        // Update selected rows
        const selectedRows = expiredMedicineAgGrid.gridApi?.getSelectedRows() || [];
        setSelectedMedicineBatchs(selectedRows);

        // If no rows selected, reset supplierId
        if (selectedRows.length === 0) {
            setSelectedSupplierId(null);
        }
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
                    {t(i18n.translationKey.listOfExpiredMedicines)}
                </Typography>

                <Paper sx={{ my: 3 }}>
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <SearchBox
                            onChange={(value) => setSearchExpiredMedicineTerm(value)}
                            placeholder={t(i18n.translationKey.searchBatchOrMedicineName)}
                            fullWidth
                            className="basis-1/3"
                        />
                        <Button
                            variant="outlined"
                            disabled={!selectedMedicineBatchs.length}
                            onClick={() => {
                                setOpenReturnModal(true);
                            }}
                        >
                            {t(i18n.translationKey.createReturnForm)}
                        </Button>
                    </Box>
                </Paper>

                <AgDataGrid
                    {...expiredMedicineAgGrid}
                    rowData={listMedicineBatches}
                    columnDefs={columnDefs}
                    totalItems={totalMedicineBatchesItems}
                    pageSize={pageSize}
                    pagination
                    pageIndex={pageIndex}
                    onPageChange={handlePageChange}
                    onRowSelected={handleRowSelected}
                />
            </Box>
            <CreateExpiredReturnModal
                open={openReturnModal}
                onClose={() => {
                    setOpenReturnModal(false);
                }}
                selectedMedicineBatchs={selectedMedicineBatchs}
            />
        </Box>
    );
};

export default NearlyExpiredMedicineBatchPage;
