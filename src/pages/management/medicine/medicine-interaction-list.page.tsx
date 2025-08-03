import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import { useMemo, useState } from "react";
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
import { showToast } from "~/utils";
import { useQueryGetMedicineInteractions } from "~/services/inventory/hooks/queries/use-query-get-medicine-interactions";
import { useQueryGetMedicines } from "~/services/inventory/hooks/queries/use-query-get-medicines";
import { useMutationUpdateMedicineInteraction } from "~/services/inventory/hooks/mutations/use-mutation-update-medicine-interaction";
import { QueryKey } from "~/constants/query-key";
import { MedicineInteraction } from "~/services/inventory/infras/types";
import { ConfirmPasswordDialog } from "./ConfirmPasswordDialog";
import { useMutationDeleteMedicineInteraction } from "~/services/inventory/hooks/mutations/use-mutation-delete-medicine-interaction";

type FormValues = Pick<
    MedicineInteraction,
    | "id"
    | "medicineId1"
    | "medicineId2"
    | "harmfulEffects"
    | "mechanism"
    | "preventiveActions"
    | "referenceInfo"
    | "notes"
    | "isSuspended"
>;

export default function MedicineInteractionListPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { onGridReady } = useAgGrid({ rowSelection: "single" });
    const { handlePageChange, pageIndex, pageSize } = usePagination();
    const navigate = useNavigate();

    const [selectedRow, setSelectedRow] = useState<MedicineInteraction | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const { mutate: deleteInteraction } = useMutationDeleteMedicineInteraction();

    const editForm = useForm<FormValues>({
        defaultValues: {
            id: 0,
            medicineId1: 0,
            medicineId2: 0,
            harmfulEffects: "",
            mechanism: "",
            preventiveActions: "",
            referenceInfo: "",
            notes: "",
            isSuspended: false,
        },
    });

    const { data: medicineListData } = useQueryGetMedicines({
        isEnabled: true,
        query: useMemo(() => ({ pageIndex: 1, pageSize: 999 }), []),
    });

    const { mutate: updateInteraction } = useMutationUpdateMedicineInteraction();

    const query = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

    const { data, isLoading, refetch } = useQueryGetMedicineInteractions({
        isEnabled: true,
        query,
    });

    const medicineInteractions = useMemo(() => {
        return (
            data?.medicineInteractions.map((item) => ({
                ...item,
                isSuspended: Boolean(item.isSuspended),
            })) ?? []
        );
    }, [data]);

    const medicineOptions =
        medicineListData?.medicines.map((m) => ({
            label: m.medicineName,
            value: m.id,
        })) ?? [];

    const columnDefs = useMemo<ColDef<MedicineInteraction>[]>(
        () => [
            { headerName: t(i18n.translationKey.medicine1), field: "medicineName1", flex: 1 },
            { headerName: t(i18n.translationKey.medicine2), field: "medicineName2", flex: 1 },
            { headerName: t(i18n.translationKey.harmfulEffects), field: "harmfulEffects", flex: 2 },
            { headerName: t(i18n.translationKey.mechanism), field: "mechanism", flex: 2 },
            { headerName: t(i18n.translationKey.preventiveActions), field: "preventiveActions", flex: 2 },
            { headerName: t(i18n.translationKey.referenceInfo), field: "referenceInfo", flex: 2 },
            { headerName: t(i18n.translationKey.note), field: "notes", flex: 2 },
            {
                headerName: t(i18n.translationKey.inventoryLimitStockSuspensionStatus),
                field: "isSuspended",
                flex: 1,
                cellRenderer: "agCellWrapper",
                valueFormatter: ({ value }) => t(`${i18n.translationKey.inventoryLimitStockSuspensionEnum}.${value}`),
            },
        ],
        [t],
    );

    const totalItems = data?.totalItems ?? 0;

    const handleRowClick = (e: RowClickedEvent<MedicineInteraction>) => {
        setSelectedRow(e.data);
    };

    const handleCreate = () => navigate("/medicine/create-medicine-interaction");

    const handleEdit = () => {
        if (!selectedRow) return showToast.error(t(i18n.translationKey.noRowSelected));
        editForm.reset({ ...selectedRow });
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        const values = editForm.getValues();
        const updatedValues: FormValues = {
            ...values,
            isSuspended: Boolean(values.isSuspended),
        };
        updateInteraction(updatedValues, {
            onSuccess: () => {
                showToast.success(t(i18n.translationKey.updateSuccess));
                setIsEditModalOpen(false);
                setSelectedRow(null);
                queryClient.invalidateQueries({
                    queryKey: [QueryKey.INVENTORY.GET_MEDICINE_INTERACTIONS_WITH_PAGINATION],
                });
                refetch();
            },
            onError: () => showToast.error(t(i18n.translationKey.updateFailed)),
        });
    };

    const handleDelete = () => {
        if (!selectedRow) {
            showToast.error(t(i18n.translationKey.noRowSelected));
            return;
        }

        setIsPasswordDialogOpen(true);
    };

    return (
        <Box p={3}>
            <Grid container spacing={2} className="px-4 py-5">
                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.addNew)}
                        startIcon={<AddCircle />}
                        onClick={handleCreate}
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
            </Grid>

            <AgDataGrid
                columnDefs={columnDefs}
                rowData={medicineInteractions}
                loading={isLoading}
                rowSelection="single"
                onGridReady={onGridReady}
                onRowClicked={handleRowClick}
                pagination
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />

            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{t("inventory.medicineInteractionList.editInteraction")}</DialogTitle>
                <DialogContent dividers>
                    <DynamicForm form={editForm}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    name="medicineId1"
                                    label={t(i18n.translationKey.medicine1)}
                                    render="select"
                                    options={medicineOptions}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    name="medicineId2"
                                    label={t(i18n.translationKey.medicine2)}
                                    render="select"
                                    options={medicineOptions}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormItem
                                    name="isSuspended"
                                    label={t(i18n.translationKey.inventoryLimitStockSuspensionStatus)}
                                    render="select"
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
                            <Grid size={12}>
                                <FormItem
                                    name="harmfulEffects"
                                    label="Harmful Effects"
                                    render="text-area"
                                    multiline
                                    minRows={2}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormItem name="mechanism" label="Mechanism" render="text-area" multiline minRows={2} />
                            </Grid>
                            <Grid size={12}>
                                <FormItem
                                    name="preventiveActions"
                                    label="Preventive Actions"
                                    render="text-area"
                                    multiline
                                    minRows={2}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormItem
                                    name="referenceInfo"
                                    label="Reference Info"
                                    render="text-area"
                                    multiline
                                    minRows={2}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormItem name="notes" label="Notes" render="text-area" multiline minRows={2} />
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
                    if (!selectedRow?.id) return;

                    deleteInteraction(selectedRow.id, {
                        onSuccess: () => {
                            showToast.success(t(i18n.translationKey.deleteMedicineInteractionSuccess));
                            setSelectedRow(null);
                            setIsPasswordDialogOpen(false);
                            queryClient.invalidateQueries({
                                queryKey: [QueryKey.INVENTORY.GET_MEDICINE_INTERACTIONS_WITH_PAGINATION],
                            });
                            refetch();
                        },
                        onError: () => {
                            showToast.error(t(i18n.translationKey.deleteMedicineInteractionFailed));
                            setIsPasswordDialogOpen(false);
                        },
                    });
                }}
            />
        </Box>
    );
}
