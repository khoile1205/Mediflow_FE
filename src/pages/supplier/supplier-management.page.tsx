import { Add, Edit, Visibility } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { ICellRendererParams, RowDoubleClickedEvent } from "ag-grid-community";
import { ColDef } from "node_modules/ag-grid-community/dist/types/src/entities/colDef";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import i18n from "~/configs/i18n";
// import { SupplierDetailsModal } from "../appointments/follow-up/appointment-detail.modal";
import SearchBox from "~/components/common/search-box";
import { Supplier } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryGetListSupplier } from "~/services/supplier/hooks/queries";
import { SupplierStatusLabel } from "./components";
import { SupplierDetailsModal } from "./supplier-detail.modal";
import { UpsertSupplierModal } from "./upsert-supplier.modal";

const SupplierManagementPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchSupplierTerm, setSearchSupplierTerm] = React.useState<string>("");
    const [openSupplierDetails, setOpenSupplierDetails] = React.useState<boolean>(false);
    const [openAddSupplier, setOpenAddSupplier] = React.useState<boolean>(false);
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);

    const [selectedSupplier, setSelectedSupplier] = React.useState<Supplier>();
    const suppliersAgGrid = useAgGrid<Supplier>({});

    const columnDefs: ColDef<Supplier>[] = [
        {
            field: "supplierCode",
            headerName: t(i18n.translationKey.supplierCode),
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
            field: "contactPerson",
            headerName: t(i18n.translationKey.contactPerson),
            cellClass: "ag-cell-center",

            flex: 1,
        },
        {
            field: "phone",
            headerName: t(i18n.translationKey.phoneNumber),
            cellClass: "ag-cell-center",
            flex: 0.8,
        },
        {
            field: "email",
            headerName: t(i18n.translationKey.email),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            field: "address",
            headerName: t(i18n.translationKey.address),
            cellClass: "ag-cell-center",
            flex: 1,
        },
        {
            headerName: t(i18n.translationKey.status),
            cellRenderer: (params: ICellRendererParams<Supplier>) => (
                <SupplierStatusLabel expiredAt={params.data.expiredDate} />
            ),
            cellClass: "ag-cell-center",
        },
        {
            cellRenderer: (params: ICellRendererParams<Supplier>) => (
                <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title={t(i18n.translationKey.view)}>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setSelectedSupplier(params.data);
                                setOpenSupplierDetails(true);
                            }}
                        >
                            <Visibility />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t(i18n.translationKey.edit)}>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setSelectedSupplier(params.data);
                                setIsEditMode(true);
                                setOpenAddSupplier(true);
                            }}
                        >
                            <Edit />
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
        data: { suppliers, totalItems: totalSuppliersItems },
    } = useQueryGetListSupplier({ pageIndex, pageSize, searchTerm: searchSupplierTerm });

    const handleRowDoubleClicked = (params: RowDoubleClickedEvent<Supplier>) => {
        setSelectedSupplier(params.data);
        setOpenSupplierDetails(true);
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
                    {t(i18n.translationKey.supplierManagement)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t(i18n.translationKey.supplierManagementDescription)}
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
                            onChange={(value) => setSearchSupplierTerm(value)}
                            placeholder={t(i18n.translationKey.searchSupplier)}
                            fullWidth
                            className="basis-1/3"
                        />
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => setOpenAddSupplier(!openAddSupplier)}
                        >
                            {t(i18n.translationKey.createNewSupplier)}
                        </Button>
                    </Box>
                </Paper>

                <AgDataGrid
                    {...suppliersAgGrid}
                    rowData={suppliers}
                    columnDefs={columnDefs}
                    totalItems={totalSuppliersItems}
                    pageSize={pageSize}
                    pagination
                    pageIndex={pageIndex}
                    onPageChange={handlePageChange}
                    onRowDoubleClicked={handleRowDoubleClicked}
                />
            </Box>
            <SupplierDetailsModal
                open={openSupplierDetails}
                onClose={() => {
                    setSelectedSupplier(null);
                    setOpenSupplierDetails(false);
                }}
                supplierId={selectedSupplier?.id}
            />
            <UpsertSupplierModal
                mode={isEditMode ? "edit" : "create"}
                supplierId={selectedSupplier?.id}
                onClose={() => {
                    setOpenAddSupplier(false);
                    setIsEditMode(false);
                    setSelectedSupplier(null);
                }}
                open={openAddSupplier}
            />
        </Box>
    );
};

export default SupplierManagementPage;
