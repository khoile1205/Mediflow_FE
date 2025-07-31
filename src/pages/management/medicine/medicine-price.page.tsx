import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ActionButton } from "~/components/common/action-button";
import AgDataGrid from "~/components/common/ag-grid/ag-grid";
import { useAgGrid } from "~/components/common/ag-grid/hooks";
import Dialog from "~/components/common/dialog/dialog";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import usePagination from "~/hooks/use-pagination";
import { useMutationDeleteMedicinePrice } from "~/services/inventory/hooks/mutations/use-mutation-delete-medicine-price";
import { useMutationUpdateMedicinePrice } from "~/services/inventory/hooks/mutations/use-mutation-update-medicine-price";
import { useQueryGetMedicinePrices } from "~/services/inventory/hooks/queries/use-query-get-medicine-prices";
import { useQueryGetMedicinePriceById } from "~/services/inventory/hooks/queries/use-query-get-medicine-prices-by-id";
import { showToast } from "~/utils";
import { ConfirmPasswordDialog } from "./ConfirmPasswordDialog";

interface MedicinePriceFormValues {
    id: number;
    medicineId?: number;
    medicineName?: string;
    unitPrice: number;
    currency: string;
    vatRate: number;
    vatAmount: number;
    originalPriceAfterVat: number;
    originalPriceBeforeVat: number;
    isSuspended: string;
    isCancelled?: boolean;
    createdAt?: string;
    lastUpdatedAt?: string;
}

export default function MedicinePriceListPage() {
    const { t } = useTranslation();
    const { handlePageChange, pageIndex, pageSize } = usePagination();
    const navigate = useNavigate();
    const [columnDefs, setColumnDefs] = useState<ColDef<MedicinePriceFormValues>[]>([]);
    const [selectedMedicinePriceId, setSelectedMedicinePriceId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<MedicinePriceFormValues>({
        defaultValues: {
            id: 0,
            unitPrice: 0,
            currency: "VND",
            vatRate: 0,
            vatAmount: 0,
            originalPriceAfterVat: 0,
            originalPriceBeforeVat: 0,
            isSuspended: "false",
            isCancelled: false,
        },
    });

    const { watch, setValue, reset } = form;

    const mutationUpdateMedicinePrice = useMutationUpdateMedicinePrice();
    const mutationDeleteMedicinePrice = useMutationDeleteMedicinePrice();

    const { onGridReady } = useAgGrid({ rowSelection: "single" });

    const { data, isLoading, refetch } = useQueryGetMedicinePrices({
        isEnabled: true,
        query: {
            pageIndex,
            pageSize,
        },
    });

    const { data: detailData, refetch: refetchDetail } = useQueryGetMedicinePriceById({
        id: selectedMedicinePriceId ?? 0,
        isEnabled: selectedMedicinePriceId !== null && isEditModalOpen,
    });

    useEffect(() => {
        if (detailData) {
            reset({
                ...detailData,
                currency: detailData.currency ?? "VND",
                isSuspended: detailData.isSuspended ? "true" : "false",
                isCancelled: detailData.isCancelled ?? false,
            });
        }
    }, [detailData, reset]);

    const watchedUnitPrice = watch("unitPrice");
    const watchedVatRate = watch("vatRate");

    useEffect(() => {
        const unitPrice = Number(watchedUnitPrice);
        const vatRate = Number(watchedVatRate);

        if (isNaN(unitPrice) || isNaN(vatRate)) return;

        const vatAmount = unitPrice * vatRate;
        const originalPriceBeforeVat = unitPrice;
        const originalPriceAfterVat = unitPrice + vatAmount;

        setValue("vatAmount", vatAmount, { shouldValidate: true, shouldDirty: true });
        setValue("originalPriceBeforeVat", originalPriceBeforeVat, {
            shouldValidate: true,
            shouldDirty: true,
        });
        setValue("originalPriceAfterVat", originalPriceAfterVat, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [watchedUnitPrice, watchedVatRate, setValue]);

    useEffect(() => {
        setColumnDefs([
            {
                headerName: t(i18n.translationKey.medicineName),
                field: "medicineName",
                flex: 1,
                sortable: true,
            },
            {
                headerName: t(i18n.translationKey.unitPrice),
                field: "unitPrice",
                flex: 1,
                sortable: true,
                valueFormatter: ({ value, data }) =>
                    `${value?.toLocaleString("vi-VN")} ${data?.currency === "USD" ? "$" : "₫"}`,
                cellStyle: { textAlign: "right" },
            },
            {
                headerName: t(i18n.translationKey.currency),
                field: "currency",
                flex: 0.5,
                sortable: false,
            },
            {
                headerName: t(i18n.translationKey.vatRate),
                field: "vatRate",
                flex: 0.5,
                valueFormatter: ({ value }) => (value * 100).toFixed(2) + "%",
                cellStyle: { textAlign: "right" },
            },
            {
                headerName: t(i18n.translationKey.vatAmount),
                field: "vatAmount",
                flex: 1,
                valueFormatter: ({ value, data }) =>
                    `${value?.toLocaleString("vi-VN")} ${data?.currency === "USD" ? "$" : "₫"}`,
                cellStyle: { textAlign: "right" },
            },
            {
                headerName: t(i18n.translationKey.originalPriceAfterVat),
                field: "originalPriceAfterVat",
                flex: 1,
                valueFormatter: ({ value, data }) =>
                    `${value?.toLocaleString("vi-VN")} ${data?.currency === "USD" ? "$" : "₫"}`,
                cellStyle: { textAlign: "right" },
            },
            {
                headerName: t(i18n.translationKey.originalPriceBeforeVat),
                field: "originalPriceBeforeVat",
                flex: 1,
                valueFormatter: ({ value, data }) =>
                    `${value?.toLocaleString("vi-VN")} ${data?.currency === "USD" ? "$" : "₫"}`,
                cellStyle: { textAlign: "right" },
            },
            {
                headerName: t(i18n.translationKey.inventoryLimitStockSuspensionStatus),
                field: "isSuspended",
                flex: 1,
                cellRenderer: "agCellWrapper",
                valueFormatter: ({ value }) => t(`${i18n.translationKey.inventoryLimitStockSuspensionEnum}.${value}`),
                sortable: true,
            },
            {
                headerName: t(i18n.translationKey.createdAt),
                field: "createdAt",
                flex: 1,
                valueFormatter: ({ value }) => (value ? new Date(value).toLocaleString("vi-VN") : ""),
            },
            {
                headerName: t(i18n.translationKey.lastUpdatedAt),
                field: "lastUpdatedAt",
                flex: 1,
                valueFormatter: ({ value }) => (value ? new Date(value).toLocaleString("vi-VN") : ""),
            },
        ]);
    }, [t]);

    const handleRowClick = (event: RowClickedEvent<MedicinePriceFormValues>) => {
        const selected = event.data;
        if (!selected) return;
        setSelectedMedicinePriceId(selected.id);
        if (isEditModalOpen) setIsEditModalOpen(false);
    };

    const handleEditClick = () => {
        if (selectedMedicinePriceId !== null) {
            refetchDetail();
            setIsEditModalOpen(true);
        }
    };

    const handleSave = async () => {
        if (!selectedMedicinePriceId) return;

        const values = form.getValues();

        try {
            const updatedValues = {
                id: selectedMedicinePriceId,
                medicineId: values.medicineId || 0,
                unitPrice: values.unitPrice,
                currency: values.currency ?? "VND",
                vatRate: values.vatRate,
                vatAmount: values.vatAmount,
                originalPriceBeforeVat: values.originalPriceBeforeVat,
                originalPriceAfterVat: values.originalPriceAfterVat,
                isSuspended: values.isSuspended === "true",
                isCancelled: values.isCancelled ?? false,
            };

            await mutationUpdateMedicinePrice.mutateAsync(updatedValues);

            showToast.success(t(i18n.translationKey.updateMedicinePriceSuccess));
            setIsEditModalOpen(false);
            setSelectedMedicinePriceId(null);
            form.reset();
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "getMedicinePrices",
            });
            refetch();
        } catch {
            showToast.error(t(i18n.translationKey.updateMedicinePriceFailed));
        }
    };

    const handleDelete = () => {
        if (!selectedMedicinePriceId) return;
        setIsPasswordDialogOpen(true);
    };

    return (
        <Box p={3}>
            <Grid container spacing={2} justifyContent="flex-start" mb={2}>
                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.addNew)}
                        startIcon={<AddCircle />}
                        size="small"
                        variant="outlined"
                        onClick={() => navigate("/medicine/create-medicine-price")}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.edit)}
                        startIcon={<Edit />}
                        size="small"
                        variant="outlined"
                        disabled={!selectedMedicinePriceId}
                        onClick={handleEditClick}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.delete)}
                        startIcon={<Delete />}
                        size="small"
                        variant="outlined"
                        disabled={!selectedMedicinePriceId}
                        onClick={handleDelete}
                    />
                </Grid>
            </Grid>

            <AgDataGrid
                onGridReady={onGridReady}
                columnDefs={columnDefs}
                rowData={data?.medicinePrices || []}
                onRowClicked={handleRowClick}
                rowSelection="single"
                pagination
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalItems={data?.totalItems || 0}
                onPageChange={handlePageChange}
                loading={isLoading}
            />

            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t(i18n.translationKey.editMedicinePrice)}</DialogTitle>
                <DialogContent dividers>
                    <DynamicForm form={form}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <FormItem
                                    render="input-number"
                                    name="unitPrice"
                                    label={t(i18n.translationKey.unitPrice)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormItem
                                    render="select"
                                    name="currency"
                                    label={t(i18n.translationKey.currency)}
                                    options={[
                                        { label: "VND", value: "VND" },
                                        { label: "USD", value: "USD" },
                                    ]}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormItem render="input-number" name="vatRate" label={t(i18n.translationKey.vatRate)} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
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
                            <Grid size={{ xs: 12 }}>
                                <FormItem
                                    render="input-number"
                                    name="vatAmount"
                                    label={t(i18n.translationKey.vatAmount)}
                                    disabled
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormItem
                                    render="input-number"
                                    name="originalPriceAfterVat"
                                    label={t(i18n.translationKey.originalPriceAfterVat)}
                                    disabled
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormItem
                                    render="input-number"
                                    name="originalPriceBeforeVat"
                                    label={t(i18n.translationKey.originalPriceBeforeVat)}
                                    disabled
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

            <ConfirmPasswordDialog
                open={isPasswordDialogOpen}
                onClose={() => setIsPasswordDialogOpen(false)}
                onConfirmed={() => {
                    if (!selectedMedicinePriceId) return;
                    mutationDeleteMedicinePrice.mutate(selectedMedicinePriceId, {
                        onSuccess: () => {
                            showToast.success(t(i18n.translationKey.deleteMedicineSuccess));
                            queryClient.invalidateQueries({
                                queryKey: ["getMedicinePrices"],
                            });
                            setSelectedMedicinePriceId(null);
                            setIsPasswordDialogOpen(false);
                            refetch();
                        },
                        onError: () => {
                            showToast.error(t(i18n.translationKey.deleteMedicineFailed));
                            setIsPasswordDialogOpen(false);
                        },
                    });
                }}
            />
        </Box>
    );
}
