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
import { Medicine } from "~/entities/medicine";
import usePagination from "~/hooks/use-pagination";
import { useMutationDeleteMedicine } from "~/services/inventory/hooks/mutations/use-mutation-delete-medicine";
import { useMutationUpdateMedicine } from "~/services/inventory/hooks/mutations/use-mutation-update-medicine";
import { useQueryGetMedicines } from "~/services/inventory/hooks/queries/use-query-get-medicines";
import { inventoryApis } from "~/services/inventory/infras/inventory.api";
import { UpdateMedicineDto, VaccineType } from "~/services/inventory/infras/types";
import { showToast } from "~/utils";

interface SearchFormValues {
    name: string;
    code: string;
}

export default function MedicineListPage() {
    const { t } = useTranslation();
    const { handlePageChange, pageIndex, pageSize } = usePagination();
    const [columnDefs, setColumnDefs] = useState<ColDef<Medicine>[]>([]);
    const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(null);
    const [, setIsFormEnabled] = useState(false);
    const [isAdding] = useState(false);
    const [, setIsEditing] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const searchForm = useForm<SearchFormValues>({
        defaultValues: {
            name: "",
            code: "",
        },
    });

    const handleRowClick = (event: RowClickedEvent<Medicine>) => {
        const selected = event.data;
        if (!selected) return;

        setSelectedMedicineId(selected.id);
        setIsFormEnabled(true);
        setIsEditing(true);
    };

    const medicineForm = useForm<UpdateMedicineDto>({
        defaultValues: {
            id: 0,
            medicineCode: "",
            medicineName: "",
            unit: "",
            isRequiredTestingBeforeUse: false,
            activeIngredient: "",
            usageInstructions: "",
            concentration: "",
            indications: "",
            routeOfAdministration: 1,
            nationalMedicineCode: "",
            description: "",
            note: "",
            registrationNumber: "",
            vaccineTypeId: 0,
            isSuspended: false,
            isCancelled: false,
        },
    });

    const [vaccineTypes, setVaccineTypes] = useState<VaccineType[]>([]);

    const { mutate: deleteMedicine } = useMutationDeleteMedicine();
    const { mutate: updateMedicine } = useMutationUpdateMedicine();

    const navigate = useNavigate();

    const { onGridReady } = useAgGrid({ rowSelection: "single" });

    const { data, isLoading, refetch } = useQueryGetMedicines({
        isEnabled: true,
        query: {
            pageIndex,
            pageSize,
            name: searchForm.watch("name"),
            code: searchForm.watch("code"),
        },
    });

    const medicines = data?.medicines ?? [];
    const totalItems = data?.totalItems ?? 0;

    const handleAdd = () => {
        navigate("/pharmacy/create-medicine");
    };

    const handleEdit = async () => {
        if (!selectedMedicineId) return;

        const selected = medicines.find((m) => m.id === selectedMedicineId);
        if (!selected) return showToast.error(t(i18n.translationKey.medicineNotFound));

        const response = await inventoryApis.getVaccineTypes();
        if (response?.Data) {
            setVaccineTypes(response.Data);

            const routeOfAdminMap: { [key in "IM" | "SC" | "ID" | "PO" | "IN"]: number } = {
                IM: 1,
                SC: 2,
                ID: 3,
                PO: 4,
                IN: 5,
            };

            const routeOfAdministration = selected.routeOfAdministration
                ? routeOfAdminMap[selected.routeOfAdministration as "IM" | "SC" | "ID" | "PO" | "IN"] || 1
                : 1;

            medicineForm.reset({
                ...selected,
                routeOfAdministration: routeOfAdministration,
                vaccineTypeId: selected.vaccineTypeId ?? 0,
            });

            // Log for debugging
            console.log("Selected Medicine:", selected);
            console.log("Form Values After Reset:", medicineForm.getValues());

            setIsEditModalOpen(true);
        }
    };

    const handleSave = () => {
        const values = medicineForm.getValues();
        if (!selectedMedicineId) return;

        updateMedicine(
            {
                ...values,
                id: selectedMedicineId,
                isRequiredTestingBeforeUse: values.isRequiredTestingBeforeUse ?? false,
                isSuspended: values.isSuspended ?? false,
                isCancelled: values.isCancelled ?? false,
            },
            {
                onSuccess: () => {
                    showToast.success(t(i18n.translationKey.updateMedicineSuccess));
                    setIsEditModalOpen(false);
                    setSelectedMedicineId(null);
                    setIsFormEnabled(false);
                    medicineForm.reset();
                    queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "getMedicineList" });
                    refetch();
                },
                onError: () => showToast.error(t(i18n.translationKey.updateMedicineFailed)),
            },
        );
    };

    const handleDelete = () => {
        if (!selectedMedicineId) return;
        deleteMedicine(selectedMedicineId, {
            onSuccess: () => {
                showToast.success(t(i18n.translationKey.deleteMedicineSuccess));
                setSelectedMedicineId(null);
                setIsFormEnabled(false);
                queryClient.invalidateQueries({ queryKey: ["getMedicineList"] });
            },
            onError: () => showToast.error(t(i18n.translationKey.deleteMedicineFailed)),
        });
    };

    useEffect(() => {
        setColumnDefs([
            { headerName: t(i18n.translationKey.medicineCode), field: "medicineCode", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.medicineName), field: "medicineName", flex: 1.5, sortable: true },
            { headerName: t(i18n.translationKey.vaccineTypeName), field: "vaccineTypeName", flex: 1 },
            { headerName: t(i18n.translationKey.unit), field: "unit", flex: 1 },
            { headerName: t(i18n.translationKey.activeIngredient), field: "activeIngredient", flex: 1.5 },
            { headerName: t(i18n.translationKey.dosage), field: "concentration", flex: 1 },
            { headerName: t(i18n.translationKey.usageInstructions), field: "usageInstructions", flex: 2 },
            { headerName: t(i18n.translationKey.indications), field: "indications", flex: 2 },
            { headerName: t(i18n.translationKey.routeOfAdministration), field: "routeOfAdministration", flex: 1 },
            { headerName: t(i18n.translationKey.nationalMedicineCode), field: "nationalMedicineCode", flex: 1 },
            { headerName: t(i18n.translationKey.registrationNumber), field: "registrationNumber", flex: 1 },
            {
                headerName: t(i18n.translationKey.unitPrice),
                field: "unitPrice",
                flex: 1,
                valueFormatter: ({ value }) => `${value?.toLocaleString("vi-VN")} ₫`,
            },
            { headerName: t(i18n.translationKey.note), field: "note", flex: 1.5 },
        ]);
    }, [t]);

    return (
        <Box p={3}>
            <DynamicForm form={searchForm}>
                <Grid container spacing={2} className="px-4 py-5" alignItems="center" justifyContent="flex-start">
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.addNew)}
                            startIcon={<AddCircle />}
                            size="small"
                            variant="outlined"
                            onClick={handleAdd}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.edit)}
                            startIcon={<Edit />}
                            size="small"
                            variant="outlined"
                            onClick={handleEdit}
                            disabled={!selectedMedicineId || isAdding}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.delete)}
                            startIcon={<Delete />}
                            size="small"
                            variant="outlined"
                            onClick={handleDelete}
                            disabled={!selectedMedicineId || isAdding}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                </Grid>

                <Grid size={12}>
                    <AgDataGrid
                        onGridReady={onGridReady}
                        columnDefs={columnDefs}
                        rowData={medicines}
                        onRowClicked={handleRowClick}
                        rowSelection="single"
                        pagination
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        loading={isLoading}
                    />
                </Grid>
            </DynamicForm>
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{t(i18n.translationKey.editMedicine)}</DialogTitle>
                <DialogContent dividers>
                    <DynamicForm form={medicineForm}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="text-input"
                                    name="medicineCode"
                                    label={t(i18n.translationKey.medicineCode)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="text-input"
                                    name="medicineName"
                                    label={t(i18n.translationKey.medicineName)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem render="text-input" name="unit" label={t(i18n.translationKey.unit)} />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="text-input"
                                    name="activeIngredient"
                                    label={t(i18n.translationKey.activeIngredient)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="text-input"
                                    name="concentration"
                                    label={t(i18n.translationKey.dosage)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="text-input"
                                    name="usageInstructions"
                                    label={t(i18n.translationKey.usageInstructions)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="text-input"
                                    name="indications"
                                    label={t(i18n.translationKey.indications)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="select"
                                    name="routeOfAdministration"
                                    label={t(i18n.translationKey.routeOfAdministration)}
                                    options={[
                                        { value: 1, label: t(i18n.translationKey.routeAdminIM) },
                                        { value: 2, label: t(i18n.translationKey.routeAdminSC) },
                                        { value: 3, label: t(i18n.translationKey.routeAdminID) },
                                        { value: 4, label: t(i18n.translationKey.routeAdminPO) },
                                        { value: 5, label: t(i18n.translationKey.routeAdminIN) },
                                    ].map(({ value, label }) => ({ value: Number(value), label }))}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="text-input"
                                    name="nationalMedicineCode"
                                    label={t(i18n.translationKey.nationalMedicineCode)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="text-input"
                                    name="registrationNumber"
                                    label={t(i18n.translationKey.registrationNumber)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormItem
                                    render="select"
                                    name="vaccineTypeId"
                                    label={t(i18n.translationKey.vaccineTypeName)}
                                    options={vaccineTypes.map((type) => ({
                                        label: type.vaccinatTypeName,
                                        value: type.vaccineTypeId,
                                    }))}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormItem
                                    render="text-area"
                                    name="note"
                                    label={t(i18n.translationKey.note)}
                                    multiline
                                    minRows={2}
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
        </Box>
    );
}
