import { AddCircle, Save, Undo } from "@mui/icons-material";
import { Box, Grid, Stack } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { Supplier } from "~/entities/supplier";
import { getAxiosErrorMessageKey } from "~/libs/axios/helper";
import { IPagination } from "~/libs/axios/types";
import { inventoryService } from "~/services/inventory";
import { showToast } from "~/utils";
import ImportPharmaceuticalInformation from "./pharmaceutical_information";
import { ImportMedicineFromSupplierFormValues } from "./types";
import { ImportMedicineFromSupplierDocumentRequest } from "~/services/inventory/types";
import { formatDate } from "~/utils/date-time";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { useAuth } from "~/contexts/auth.context";
import { RowSelectedEvent } from "ag-grid-community";

const defaultValues: ImportMedicineFromSupplierFormValues = {
    documentCode: "",
    documentNumber: "",
    importDate: new Date(),
    note: "",
    supportingDocument: "",
    receivedById: 0,
    endDate: new Date(),
    details: [],
    warehouseId: 1,
};

const ImportInventoryFromSupplier: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isAddNew, setIsAddNew] = React.useState<boolean>(false);
    const [supplierPaginationData, setSupplierPaginationData] = React.useState<IPagination<Supplier>>();
    const form = useForm<ImportMedicineFromSupplierFormValues>({
        defaultValues: {
            ...defaultValues,
            receivedById: user.id,
            receivedByName: user.name,
        },
    });

    const handleCancel = () => {
        setIsAddNew(false);
        form.reset(form.formState.defaultValues);
    };

    const handleAddNew = () => {
        setIsAddNew(true);
        generateDocumentCode();
        form.resetField("details");
    };

    const generateDocumentCode = async () => {
        try {
            const response = await inventoryService.generateDocumentCode();
            const { documentCode, documentNumber } = response.Data;
            form.setValue("documentCode", documentCode);
            form.setValue("documentNumber", documentNumber);
        } catch (error) {
            showToast.error(getAxiosErrorMessageKey(error));
        }
    };

    const handleSelectSupplier = (selectedRow: RowSelectedEvent<Supplier>) => {
        form.setValue("supplierId", selectedRow.data.id);
        form.setValue("supplierName", selectedRow.data.supplierName);
    };

    const updateDetails = (newDetails: ImportMedicineFromSupplierFormValues["details"]) => {
        form.setValue("details", newDetails);
    };

    const onSaveImportDocument = async (importDocument: ImportMedicineFromSupplierFormValues) => {
        if (importDocument.details.length === 0) {
            showToast.error(t(i18n.translationKey.pleaseAddPharmaceuticalInformation));
            return;
        }

        const importDocumentRequest = getDocumentRequest(importDocument);

        try {
            await inventoryService.saveImportDocument(importDocumentRequest);
            showToast.success(t(i18n.translationKey.documentCreateSuccessfully));
            setIsAddNew(false);
            form.reset(form.formState.defaultValues);
        } catch (error) {
            showToast.error(getAxiosErrorMessageKey(error));
        }
    };

    const getDocumentRequest = (
        importDocument: ImportMedicineFromSupplierFormValues,
    ): ImportMedicineFromSupplierDocumentRequest => {
        return {
            documentCode: importDocument.documentCode,
            documentNumber: importDocument.documentNumber,
            warehouseId: importDocument.warehouseId,
            importDate: formatDate(importDocument.importDate as Date, DATE_TIME_FORMAT["yyyy-MM-dd"]),
            supplierId: importDocument.supplierId,
            note: importDocument.note,
            receivedById: importDocument.receivedById,
            supportingDocument: importDocument.supportingDocument,
            endDate: formatDate(importDocument.endDate as Date, DATE_TIME_FORMAT["yyyy-MM-dd"]),
            details: importDocument.details.map((detail) => ({
                medicineId: detail.medicineId,
                batchNumber: detail.batchNumber,
                sgk_CPNK: detail.sgk_CPNK,
                note: detail.note,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                expiryDate: formatDate(detail.expiryDate, DATE_TIME_FORMAT["yyyy-MM-dd"]),
                manufacturerId: detail.manufacturerId,
                countryId: detail.countryId,
                isFree: detail.isFree,
            })),
        };
    };

    React.useEffect(() => {
        initializeData();
    }, []);

    const initializeData = async () => {
        await Promise.allSettled([getListSupplier()]);
    };

    const getListSupplier = async (pageIndex: number = 1, pageSize: number = 2) => {
        try {
            const response = await inventoryService.getListSupplier({ pageIndex, pageSize });
            setSupplierPaginationData(response.Data);
        } catch (error) {
            showToast.error(getAxiosErrorMessageKey(error));
        }
    };

    const handleSupplierPageChange = React.useCallback(
        async (newPageIndex: number) => {
            const currentPageSize = supplierPaginationData?.pageSize ?? 2;
            await getListSupplier(newPageIndex, currentPageSize);
        },
        [supplierPaginationData?.pageSize],
    );

    return (
        <Box sx={{ p: { xs: 2 } }}>
            <DynamicForm form={form}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 1, sm: 2 }}
                    sx={{ width: "100%", mb: { xs: 2, lg: 3 } }}
                >
                    <ActionButton
                        label={t(i18n.translationKey.addNewDocument)}
                        startIcon={<AddCircle />}
                        onClick={handleAddNew}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.save)}
                        startIcon={<Save />}
                        disabled={!isAddNew}
                        onClick={form.handleSubmit(onSaveImportDocument)}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.cancel)}
                        startIcon={<Undo />}
                        onClick={handleCancel}
                        disabled={!isAddNew}
                    />
                </Stack>

                <Box
                    sx={{
                        borderColor: "primary.main",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderRadius: 2,
                        p: { xs: 2, sm: 4, md: 6 },
                    }}
                >
                    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Grid container spacing={{ xs: 2, sm: 4 }}>
                                <Grid size={{ xs: 12, lg: 6 }}>
                                    <FormItem
                                        name="documentCode"
                                        render="text-input"
                                        slotProps={{ input: { readOnly: true } }}
                                        placeholder={t(i18n.translationKey.documentCode)}
                                        label={t(i18n.translationKey.documentCode)}
                                        disabled={!isAddNew}
                                        required
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, lg: 6 }}>
                                    <FormItem
                                        name="importDate"
                                        render="date-picker"
                                        placeholder={t(i18n.translationKey.importDate)}
                                        label={t(i18n.translationKey.importDate)}
                                        disabled={!isAddNew}
                                        required
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        name="supplierName"
                                        render="data-grid"
                                        placeholder={t(i18n.translationKey.supplier)}
                                        label={t(i18n.translationKey.supplier)}
                                        disabled={!isAddNew}
                                        columnDefs={[
                                            { field: "supplierName", headerName: t(i18n.translationKey.supplier) },
                                            { field: "supplierCode", headerName: t(i18n.translationKey.supplierCode) },
                                            { field: "phone", headerName: t(i18n.translationKey.phoneNumber) },
                                        ]}
                                        rowData={supplierPaginationData?.data ?? []}
                                        pageIndex={supplierPaginationData?.pageIndex ?? 1}
                                        pageSize={supplierPaginationData?.pageSize ?? 10}
                                        totalItems={supplierPaginationData?.totalItems ?? 0}
                                        onRowSelected={handleSelectSupplier}
                                        onPageChange={handleSupplierPageChange}
                                        displayField="supplierName"
                                        required
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        name="note"
                                        render="text-input"
                                        placeholder={t(i18n.translationKey.note)}
                                        label={t(i18n.translationKey.note)}
                                        disabled={!isAddNew}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                <Grid size={12}>
                                    <FormItem
                                        name="supportingDocument"
                                        render="text-area"
                                        label={t(i18n.translationKey.basedOn)}
                                        placeholder={t(i18n.translationKey.basedOn)}
                                        disabled={!isAddNew}
                                        required
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        name="receivedByName"
                                        render="text-input"
                                        label={t(i18n.translationKey.receiver)}
                                        placeholder={t(i18n.translationKey.receiver)}
                                        disabled={!isAddNew}
                                        slotProps={{ input: { readOnly: true } }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                <Grid size={12}>
                                    <FormItem
                                        name="documentNumber"
                                        render="text-input"
                                        slotProps={{ input: { readOnly: true } }}
                                        label={t(i18n.translationKey.documentNumber)}
                                        placeholder={t(i18n.translationKey.documentNumber)}
                                        disabled={!isAddNew}
                                        required
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        name="endDate"
                                        render="date-picker"
                                        placeholder={t(i18n.translationKey.endAt)}
                                        label={t(i18n.translationKey.endAt)}
                                        disabled={!isAddNew}
                                        minDate={(form.watch("importDate") as Date) ?? new Date()}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </DynamicForm>
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                <ImportPharmaceuticalInformation
                    details={form.watch("details") ?? []}
                    updateDetails={updateDetails}
                    disabled={!isAddNew}
                />
            </Box>
        </Box>
    );
};

export default ImportInventoryFromSupplier;
