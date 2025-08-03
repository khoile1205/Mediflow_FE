import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ColDef, RowClickedEvent, RowClassParams } from "ag-grid-community";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import AgDataGrid from "~/components/common/ag-grid/ag-grid";
import { useAgGrid } from "~/components/common/ag-grid/hooks";
import Dialog from "~/components/common/dialog/dialog";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import useDebounce from "~/hooks/use-debounce";
import usePagination from "~/hooks/use-pagination";
import { useMutationCreateInventoryLimitStock } from "~/services/inventory/hooks/mutations/use-mutation-create-inventory-limit-stock";
import { useMutationDeleteInventoryLimitStock } from "~/services/inventory/hooks/mutations/use-mutation-delete-inventory-limit-stock";
import { useMutationUpdateInventoryLimitStock } from "~/services/inventory/hooks/mutations/use-mutation-update-inventory-limit-stock";
import { useQueryGetInventoryLimitStocks } from "~/services/inventory/hooks/queries/use-query-get-list-inventory-limit-stock";
import { InventoryLimitStock } from "~/services/inventory/infras/types";
import { showToast } from "~/utils";
import { ConfirmPasswordDialog } from "../medicine/ConfirmPasswordDialog";
import { useQueryGetMedicinesWithPagination } from "~/services/medicine/hooks/queries/use-query-get-medicines-with-pagination";
import ModalAddInventoryLimitStock from "./modal-add-inventory-limit-stock";
import { InventoryLimitStockFormValues } from "./types";

interface SearchFormValues {
    searchKeyword: string;
}

interface FormValues {
    medicineId: number | null;
    medicineName: string;
    medicineCode: string;
    unit: string;
    minimalStockThreshold: number;
    isSuspended: string;
}

export default function InventoryLimitStockPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [selectedRow, setSelectedRow] = useState<InventoryLimitStock | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [medicinePageIndex, setMedicinePageIndex] = useState(1);
    const [medicinePageSize] = useState(10);

    const searchForm = useForm<SearchFormValues>({ defaultValues: { searchKeyword: "" } });
    const [searchKeyword, setSearchKeyword] = useState("");
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

    useEffect(() => {
        const subscription = searchForm.watch((value) => {
            setSearchKeyword(value.searchKeyword || "");
            resetPagination();
        });
        return () => subscription.unsubscribe();
    }, [searchForm]);

    const form = useForm<FormValues>({
        defaultValues: {
            medicineId: null,
            medicineName: "",
            medicineCode: "",
            unit: "",
            minimalStockThreshold: 0,
            isSuspended: "false",
        },
    });

    const { handlePageChange, pageIndex, pageSize, resetPagination } = usePagination();

    const { data, isLoading, refetch } = useQueryGetInventoryLimitStocks({
        isEnabled: true,
        query: {
            pageIndex,
            pageSize,
            searchKeyword: debouncedSearchKeyword,
        },
    });

    const { data: medicineRes } = useQueryGetMedicinesWithPagination({
        pageIndex: medicinePageIndex,
        pageSize: medicinePageSize,
    });

    const { onGridReady } = useAgGrid({ rowSelection: "single" });

    const { mutate: createLimitStock } = useMutationCreateInventoryLimitStock();
    const { mutate: updateLimitStock } = useMutationUpdateInventoryLimitStock();
    const { mutate: deleteLimitStock } = useMutationDeleteInventoryLimitStock();

    const columns = useMemo<ColDef<InventoryLimitStock>[]>(
        () => [
            { headerName: t(i18n.translationKey.medicineCode), field: "medicineCode", flex: 1 },
            { headerName: t(i18n.translationKey.medicineName), field: "medicineName", flex: 2 },
            {
                headerName: t(i18n.translationKey.unit),
                field: "unit",
                flex: 1,
                valueFormatter: ({ value }) => (value ? t(`${i18n.translationKey.medicineUnit}.${value}`) : ""),
            },
            { headerName: t(i18n.translationKey.currentStock), field: "currentStock", flex: 1 },
            { headerName: t(i18n.translationKey.minimalStockThreshold), field: "minimalStockThreshold", flex: 1 },
            { headerName: t(i18n.translationKey.difference), field: "difference", flex: 1 },
            {
                headerName: t(i18n.translationKey.status),
                field: "statusDescription",
                flex: 1,
                valueFormatter: ({ value }) =>
                    value ? t(`${i18n.translationKey.inventoryLimitStockStatus}.${value}`) : "",
                cellClassRules: {
                    "suspended-status": (params) => params.data?.isSuspended === true,
                    "critical-low-status": (params) => !params.data?.isSuspended && params.value === "Critical Low",
                    "low-status": (params) => !params.data?.isSuspended && params.value === "Low",
                    "normal-status": (params) => !params.data?.isSuspended && params.value === "Normal",
                    "high-status": (params) => !params.data?.isSuspended && params.value === "High",
                },
            },
            {
                headerName: t(i18n.translationKey.inventoryLimitStockSuspensionStatus),
                field: "isSuspended",
                flex: 1,
                cellRenderer: "agCellWrapper",
                valueFormatter: ({ value }) =>
                    t(`${i18n.translationKey.inventoryLimitStockSuspensionEnum}.${String(value)}`),
            },
        ],
        [t],
    );

    const rowClassRules = useMemo(
        () => ({
            "suspended-row": (params: RowClassParams<InventoryLimitStock>) => params.data?.isSuspended === true,
        }),
        [],
    );

    const handleAdd = () => setIsAddModalOpen(true);

    const handleEdit = () => {
        if (!selectedRow) return;
        form.reset({
            medicineId: selectedRow.medicineId,
            medicineCode: selectedRow.medicineCode,
            medicineName: selectedRow.medicineName,
            unit: selectedRow.unit,
            minimalStockThreshold: selectedRow.minimalStockThreshold,
            isSuspended: String(selectedRow.isSuspended),
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedRow) return;
        setIsPasswordDialogOpen(true);
    };

    const handleSave = () => {
        const values = form.getValues();
        const isSuspendedChanged = selectedRow && String(selectedRow.isSuspended) !== values.isSuspended;
        const minimalStockThresholdChanged =
            selectedRow && selectedRow.minimalStockThreshold !== values.minimalStockThreshold;

        if (selectedRow && !isSuspendedChanged && !minimalStockThresholdChanged) {
            showToast.info(t(i18n.translationKey.noChangesSaved));
            setIsEditModalOpen(false);
            return;
        }

        const payload = {
            medicineId: values.medicineId!,
            minimalStockThreshold: values.minimalStockThreshold,
            isSuspended: values.isSuspended === "true",
        };

        const existed = data?.inventoryLimitStocks.find((item) => item.medicineId === payload.medicineId);
        const mutation = selectedRow || existed ? updateLimitStock : createLimitStock;
        const args = selectedRow || existed ? { ...payload, id: selectedRow?.id || existed!.id } : payload;

        mutation(args as any, {
            onSuccess: () => {
                let successMessage = t(i18n.translationKey.createInventoryLimitStockSuccess);
                if (selectedRow || existed) {
                    if (isSuspendedChanged && minimalStockThresholdChanged) {
                        successMessage = t(i18n.translationKey.updateBothStatusAndStockSuccess);
                    } else if (isSuspendedChanged) {
                        successMessage = t(i18n.translationKey.updateSuspensionStatusSuccess);
                    } else if (minimalStockThresholdChanged) {
                        successMessage = t(i18n.translationKey.updateMinimalStockThresholdSuccess);
                    }
                }
                showToast.success(successMessage);
                setIsEditModalOpen(false);
                queryClient.invalidateQueries();
                refetch();
            },
            onError: () => {
                let errorMessage = t(i18n.translationKey.createInventoryLimitStockFailed);
                if (selectedRow || existed) {
                    if (isSuspendedChanged && minimalStockThresholdChanged) {
                        errorMessage = t(i18n.translationKey.updateBothStatusAndStockFailed);
                    } else if (isSuspendedChanged) {
                        errorMessage = t(i18n.translationKey.updateSuspensionStatusFailed);
                    } else if (minimalStockThresholdChanged) {
                        errorMessage = t(i18n.translationKey.updateMinimalStockThresholdFailed);
                    }
                }
                showToast.error(errorMessage);
            },
        });
    };

    const handleSubmitAddModal = (values: InventoryLimitStockFormValues) => {
        const payload = {
            medicineId: Number(values.medicineId),
            minimalStockThreshold: Number(values.minQuantity),
        };

        const existedActive = data?.inventoryLimitStocks.find(
            (item) => item.medicineId === payload.medicineId && !item.isSuspended && !item.isCancelled,
        );

        const existedCancelled = data?.inventoryLimitStocks.find(
            (item) => item.medicineId === payload.medicineId && (item.isSuspended || item.isCancelled),
        );

        let mutation, args;

        if (existedActive) {
            mutation = updateLimitStock;
            args = { ...payload, id: existedActive.id };
        } else if (existedCancelled) {
            mutation = updateLimitStock;
            args = {
                ...payload,
                id: existedCancelled.id,
                isSuspended: false,
                isCancelled: false,
            };
        } else {
            mutation = createLimitStock;
            args = payload;
        }

        mutation(args as any, {
            onSuccess: () => {
                showToast.success(
                    existedActive || existedCancelled
                        ? t(i18n.translationKey.updateMinimalStockThresholdSuccess)
                        : t(i18n.translationKey.createInventoryLimitStockSuccess),
                );
                queryClient.invalidateQueries();
                refetch();
                setIsAddModalOpen(false);
            },
            onError: () => {
                showToast.error(
                    existedActive || existedCancelled
                        ? t(i18n.translationKey.updateMinimalStockThresholdFailed)
                        : t(i18n.translationKey.createInventoryLimitStockFailed),
                );
            },
        });
    };

    return (
        <Box p={3}>
            <style>
                {`
    .suspended-row {
        background-color: #f0f0f0 !important;
        color: #9e9e9e !important;
    }
    .suspended-status {
        background-color: #f0f0f0 !important;
        color: #9e9e9e !important;
    }
    .critical-low-status {
        background-color: #ff6666 !important;
        color: #ffffff !important;
    }
    .low-status {
        background-color: #fff3cd !important;
        color: #856404 !important;
    }
    .normal-status {
        background-color: #ffffff !important;
        color: #000000 !important;
    }
    .high-status {
        background-color: #d4edda !important;
        color: #155724 !important;
    }
                `}
            </style>
            <DynamicForm form={searchForm}>
                <Grid container spacing={2} alignItems="center" justifyContent="flex-start" className="px-4 py-5">
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.addNew)}
                            startIcon={<AddCircle />}
                            onClick={handleAdd}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.edit)}
                            startIcon={<Edit />}
                            onClick={handleEdit}
                            disabled={!selectedRow}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.delete)}
                            startIcon={<Delete />}
                            onClick={handleDelete}
                            disabled={!selectedRow}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ pt: "18px" }}>
                        <FormItem
                            render="text-input"
                            name="searchKeyword"
                            label={t(i18n.translationKey.searchKeyword)}
                            placeholder={t(i18n.translationKey.search)}
                        />
                    </Grid>
                </Grid>
            </DynamicForm>

            <Grid size={12} p={2}>
                <AgDataGrid
                    onGridReady={onGridReady}
                    columnDefs={columns}
                    rowData={[...(data?.inventoryLimitStocks ?? [])].sort((a, b) =>
                        a.medicineCode.localeCompare(b.medicineCode),
                    )}
                    rowClassRules={rowClassRules}
                    onRowClicked={(row: RowClickedEvent<InventoryLimitStock>) => setSelectedRow(row.data)}
                    rowSelection="single"
                    pagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalItems={data?.totalItems ?? 0}
                    onPageChange={handlePageChange}
                    loading={isLoading}
                />
            </Grid>

            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t(i18n.translationKey.edit)}</DialogTitle>
                <DialogContent dividers>
                    <DynamicForm form={form}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <FormItem
                                    render="data-grid"
                                    name="medicineId"
                                    label={t(i18n.translationKey.medicineId)}
                                    columnDefs={[
                                        {
                                            field: "medicineCode",
                                            headerName: t(i18n.translationKey.medicineCode),
                                            width: 120,
                                        },
                                        {
                                            field: "medicineName",
                                            headerName: t(i18n.translationKey.medicineName),
                                            width: 200,
                                        },
                                        { field: "unit", headerName: t(i18n.translationKey.unit), width: 100 },
                                    ]}
                                    rowData={medicineRes?.listMedicines ?? []}
                                    displayField="medicineName"
                                    valueField="id"
                                    pageIndex={medicinePageIndex}
                                    pageSize={medicinePageSize}
                                    totalItems={medicineRes?.totalItems ?? 0}
                                    onPageChange={(page) => setMedicinePageIndex(page)}
                                    pagination
                                    disabled={!!selectedRow}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormItem
                                    render="input-number"
                                    name="minimalStockThreshold"
                                    label={t(i18n.translationKey.minimalStockThreshold)}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormItem
                                    render="select"
                                    name="isSuspended"
                                    label={t(i18n.translationKey.inventoryLimitStockSuspensionStatus)}
                                    options={[
                                        {
                                            value: "false",
                                            label: t(`${i18n.translationKey.inventoryLimitStockSuspensionEnum}.false`),
                                        },
                                        {
                                            value: "true",
                                            label: t(`${i18n.translationKey.inventoryLimitStockSuspensionEnum}.true`),
                                        },
                                    ]}
                                />
                            </Grid>
                        </Grid>
                    </DynamicForm>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setIsEditModalOpen(false)}>
                        {t(i18n.translationKey.cancel)}
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                        {t(i18n.translationKey.save)}
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalAddInventoryLimitStock
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleSubmitAddModal}
            />

            <ConfirmPasswordDialog
                open={isPasswordDialogOpen}
                onClose={() => setIsPasswordDialogOpen(false)}
                onConfirmed={() => {
                    if (!selectedRow) return;
                    deleteLimitStock(selectedRow.id, {
                        onSuccess: () => {
                            showToast.success(t(i18n.translationKey.deleteInventoryLimitStockSuccess));
                            queryClient.invalidateQueries();
                            setSelectedRow(null);
                            setIsPasswordDialogOpen(false);
                            refetch();
                        },
                        onError: () => {
                            showToast.error(t(i18n.translationKey.deleteInventoryLimitStockFailed));
                            setIsPasswordDialogOpen(false);
                        },
                    });
                }}
            />
        </Box>
    );
}
