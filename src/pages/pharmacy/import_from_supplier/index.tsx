import { AddCircle, Print, Save, Undo } from "@mui/icons-material";
import { Box, Grid, Stack } from "@mui/material";
import { RowSelectedEvent } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { useAuth } from "~/contexts/auth.context";
import { Supplier } from "~/entities/supplier";
import { usePagination } from "~/hooks";
import {
    useMutationGenerateImportDocumentCode,
    useMutationSaveImportDocument,
} from "~/services/inventory/hooks/mutations";
import { ImportMedicineFromSupplierDocumentRequest } from "~/services/inventory/infras/types";
import { showToast } from "~/utils";
import { formatDate } from "~/utils/date-time";
import ImportPharmaceuticalInformation from "./pharmaceutical_information";
import { ImportMedicineFromSupplierFormValues } from "./types";
import { useQueryGetListSupplier } from "~/services/supplier/hooks/queries";
import ReceiptPrinter from "./receipt-printer";
import { useReactToPrint } from "react-to-print";

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
    const { pageIndex, pageSize, handlePageChange } = usePagination();
    const receiptRef = React.useRef<HTMLDivElement>(null);

    // Query

    const {
        data: { suppliers, totalItems },
    } = useQueryGetListSupplier({
        pageIndex,
        pageSize,
    });

    // Mutation
    const { mutateAsync: generateDocumentCode } = useMutationGenerateImportDocumentCode();
    const { mutateAsync: saveImportDocument } = useMutationSaveImportDocument();
    const [isAddNew, setIsAddNew] = React.useState<boolean>(false);
    const [isPrinting, setIsPrinting] = React.useState<boolean>(false);

    const form = useForm<ImportMedicineFromSupplierFormValues>({
        defaultValues: {
            ...defaultValues,
            receivedById: user?.id,
            receivedByName: user?.name,
        },
    });

    const handleCancel = () => {
        setIsAddNew(false);
        form.reset(form.formState.defaultValues);
        setIsPrinting(false);
    };

    const handleAddNew = () => {
        setIsAddNew(true);
        handleGenerateDocumentCode();
        form.resetField("details");
    };

    const handlePrintReceipt = useReactToPrint({
        contentRef: receiptRef,
    });

    const handleGenerateDocumentCode = async () => {
        const response = await generateDocumentCode();
        form.setValue("documentCode", response.documentCode);
        form.setValue("documentNumber", response.documentNumber);
    };

    const handleSelectSupplier = (selectedRow: RowSelectedEvent<Supplier>) => {
        form.setValue("supplierId", selectedRow.data.id);
        form.setValue("supplierName", selectedRow.data.supplierName);
    };

    const updateDetails = (newDetails: ImportMedicineFromSupplierFormValues["details"]) => {
        form.setValue("details", newDetails);
    };

    const onSaveImportDocument = async (
        importDocument: ImportMedicineFromSupplierFormValues,
        isRetry: boolean = false,
    ) => {
        if (importDocument.details.length === 0) {
            showToast.error(t(i18n.translationKey.pleaseAddPharmaceuticalInformation));
            return;
        }

        const importDocumentRequest = getDocumentRequest(importDocument);
        await saveImportDocument(importDocumentRequest, {
            onSuccess: () => {
                showToast.success(t(i18n.translationKey.documentCreateSuccessfully));
                setIsAddNew(false);
                setIsPrinting(true);
            },
            onError: async () => {
                if (!isRetry) {
                    const response = await generateDocumentCode();
                    form.setValue("documentCode", response.documentCode);
                    form.setValue("documentNumber", response.documentNumber);

                    await onSaveImportDocument(form.getValues(), true);

                    setIsAddNew(false);
                    setIsPrinting(true);
                    return;
                }
            },
        });
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
                        disabled={isPrinting}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.save)}
                        startIcon={<Save />}
                        disabled={!isAddNew || isPrinting}
                        onClick={form.handleSubmit((values) => onSaveImportDocument(values))}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.printDocument)}
                        startIcon={<Print />}
                        onClick={handlePrintReceipt}
                        disabled={!isPrinting}
                    />
                    <ActionButton label={t(i18n.translationKey.cancel)} startIcon={<Undo />} onClick={handleCancel} />
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
                                        disabled={!isAddNew || isPrinting}
                                        required
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, lg: 6 }}>
                                    <FormItem
                                        name="importDate"
                                        render="date-picker"
                                        placeholder={t(i18n.translationKey.importDate)}
                                        label={t(i18n.translationKey.importDate)}
                                        disabled={!isAddNew || isPrinting}
                                        required
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        name="supplierName"
                                        render="data-grid"
                                        placeholder={t(i18n.translationKey.supplier)}
                                        label={t(i18n.translationKey.supplier)}
                                        disabled={!isAddNew || isPrinting}
                                        columnDefs={[
                                            { field: "supplierName", headerName: t(i18n.translationKey.supplier) },
                                            { field: "supplierCode", headerName: t(i18n.translationKey.supplierCode) },
                                            { field: "phone", headerName: t(i18n.translationKey.phoneNumber) },
                                        ]}
                                        rowData={suppliers}
                                        pageIndex={pageIndex}
                                        pageSize={pageSize}
                                        totalItems={totalItems}
                                        onRowSelected={handleSelectSupplier}
                                        onPageChange={handlePageChange}
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
                                        disabled={!isAddNew || isPrinting}
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
                                        disabled={!isAddNew || isPrinting}
                                        required
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        name="receivedByName"
                                        render="text-input"
                                        label={t(i18n.translationKey.receiver)}
                                        placeholder={t(i18n.translationKey.receiver)}
                                        disabled={!isAddNew || isPrinting}
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
                                        disabled={!isAddNew || isPrinting}
                                        required
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        name="endDate"
                                        render="date-picker"
                                        placeholder={t(i18n.translationKey.endAt)}
                                        label={t(i18n.translationKey.endAt)}
                                        disabled={!isAddNew || isPrinting}
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
                    disabled={!isAddNew || isPrinting}
                />
            </Box>
            <Box display={"none"}>
                <ReceiptPrinter receiptInformation={form.watch()} ref={receiptRef} />
            </Box>
        </Box>
    );
};

export default ImportInventoryFromSupplier;
