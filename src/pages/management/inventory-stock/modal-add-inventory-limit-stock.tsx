import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RowSelectedEvent } from "ag-grid-community";
import { ActionButton } from "~/components/common/action-button";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { useDebounce, usePagination } from "~/hooks";
import { useQueryGetMedicinesWithPagination } from "~/services/medicine/hooks/queries";
import { InventoryLimitStockFormValues } from "./types";
import { Medicine } from "~/entities";
import { showToast } from "~/utils";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: InventoryLimitStockFormValues) => void;
    initialData?: InventoryLimitStockFormValues | null;
}

const defaultValues: InventoryLimitStockFormValues = {
    medicineId: 0,
    medicineName: "",
    unit: "",
    minQuantity: 0,
    currentStock: 0,
};

const ModalAddInventoryLimitStock: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
    const { t } = useTranslation();
    const form = useForm<InventoryLimitStockFormValues>({
        defaultValues: initialData ?? defaultValues,
    });

    const { pageIndex, pageSize, handlePageChange, resetPagination } = usePagination({
        defaultPage: 1,
        defaultPageSize: 10,
    });

    const [searchKeyword, setSearchKeyword] = useState("");
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

    const {
        data: { listMedicines = [], totalItems = 0 },
    } = useQueryGetMedicinesWithPagination({
        pageIndex,
        pageSize,
        searchKeyword: debouncedSearchKeyword,
    });

    useEffect(() => {
        if (open) {
            resetPagination();
            setSearchKeyword("");
            if (!initialData) {
                form.reset(defaultValues);
            }
        }
    }, [open]);

    const handleSelectMedicine = (event: RowSelectedEvent<Medicine>) => {
        if (!event.data) return;
        form.setValue("medicineId", event.data.id);
        form.setValue("medicineName", event.data.medicineName);
        form.setValue("unit", event.data.unit);
        form.setValue("currentStock", event.data.currentStock || 0);
    };

    const handleSearchMedicine = (searchValue: string) => {
        setSearchKeyword(searchValue);
        resetPagination();
    };

    const handleSubmit = form.handleSubmit((values) => {
        const selectedMedicine = listMedicines.find((m) => m.id === values.medicineId);

        if (!selectedMedicine) {
            showToast.error(
                t(i18n.translationKey.notFoundMedicineWithId as string, {
                    id: values.medicineId,
                }),
            );
            return;
        }

        if (selectedMedicine.isSuspended) {
            showToast.error(
                t(i18n.translationKey.cannotAddSuspendedMedicine as string, {
                    name: selectedMedicine.medicineName,
                    id: selectedMedicine.id,
                }),
            );
            return;
        }

        onSubmit(values);
        onClose();
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? t(i18n.translationKey.edit) : t(i18n.translationKey.addNew)}</DialogTitle>
            <DynamicForm form={form}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormItem
                                render="data-grid"
                                name="medicineId"
                                label={t(i18n.translationKey.medicineId)}
                                placeholder={t(i18n.translationKey.medicineId)}
                                columnDefs={[
                                    {
                                        field: "medicineCode",
                                        headerName: t(i18n.translationKey.medicalCode),
                                        width: 100,
                                    },
                                    {
                                        field: "medicineName",
                                        headerName: t(i18n.translationKey.medicineName),
                                        width: 200,
                                    },
                                    { field: "unit", headerName: t(i18n.translationKey.unit), width: 100 },
                                ]}
                                rowData={[...listMedicines]
                                    .filter((m) => !m.isSuspended)
                                    .sort((a, b) => a.medicineCode.localeCompare(b.medicineCode))}
                                displayField="medicineName"
                                valueField="id"
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                                totalItems={totalItems}
                                onPageChange={handlePageChange}
                                onRowSelected={handleSelectMedicine}
                                onSearch={handleSearchMedicine}
                                pagination
                                required
                                disabled={!!initialData}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormItem
                                render="text-input-no-clear"
                                name="unit"
                                label={t(i18n.translationKey.unit)}
                                disabled
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormItem
                                render="input-number"
                                name="currentStock"
                                label={t(i18n.translationKey.currentStock)}
                                disabled
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 12 }}>
                            <FormItem
                                render="input-number"
                                name="minQuantity"
                                label={t(i18n.translationKey.minStock)}
                                placeholder={t(i18n.translationKey.minStock)}
                                minNumber={0}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <ActionButton label={t(i18n.translationKey.cancel)} variant="outlined" onClick={onClose} />
                    <ActionButton label={t(i18n.translationKey.save)} onClick={handleSubmit} />
                </DialogActions>
            </DynamicForm>
        </Dialog>
    );
};

export default ModalAddInventoryLimitStock;
