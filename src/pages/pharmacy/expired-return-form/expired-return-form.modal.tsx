import { Box, Button, Grid, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { Dialog } from "~/components/common/dialog";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import { EMAIL_PATTERN, PHONE_NUMBER_PATTERN } from "~/components/form/validation/pattern";
import i18n from "~/configs/i18n";
import { MedicineBatch } from "~/entities";
import { ConfirmPasswordDialog } from "~/pages/management/medicine/ConfirmPasswordDialog";
import { useMutationCreateExpiredForm } from "~/services/inventory/hooks/mutations";
import { useQueryGenerateExpiredReturnCode } from "~/services/inventory/hooks/queries";
import { ExpiredReturnFormValues } from "./types";

interface CreateExpiredReturnModalProps {
    open: boolean;
    onClose: () => void;
    selectedMedicineBatchs: MedicineBatch[];
}

export const CreateExpiredReturnModal: React.FC<CreateExpiredReturnModalProps> = ({
    open,
    onClose,
    selectedMedicineBatchs,
}) => {
    const { t } = useTranslation();
    const {
        data: { expiredReturnCode },
    } = useQueryGenerateExpiredReturnCode(open);
    const { mutateAsync: createExpiredForm } = useMutationCreateExpiredForm();
    const [isConfirmPasswordDialogOpen, setConfirmPasswordDialogOpen] = React.useState<boolean>(false);
    const medicineBatchAgGrid = useAgGrid<MedicineBatch>({});

    const form = useForm<ExpiredReturnFormValues>({
        defaultValues: {
            returnCode: "",
            reason: "",
            receiverSupplier: "",
            receiverName: "",
            receiverEmail: "",
            receiverPhone: "",
        },
    });

    const handleSubmit = async (data: ExpiredReturnFormValues) => {
        await createExpiredForm({
            ...data,
            details: selectedMedicineBatchs.map((batch) => ({
                medicineBatchId: batch.medicineBatchId,
                quantity: batch.currentQuantity,
                batchNumber: batch.batchNumber,
                expirationDate: batch.expiryDate,
            })),
        });
        setConfirmPasswordDialogOpen(false);
        onClose();
        form.reset();
    };

    const handleClose = () => {
        onClose();
        form.reset();
    };

    React.useEffect(() => {
        if (expiredReturnCode) {
            form.setValue("returnCode", expiredReturnCode);
        }
    }, [expiredReturnCode]);

    React.useEffect(() => {
        if (open && selectedMedicineBatchs.length > 0) {
            form.setValue("receiverSupplier", selectedMedicineBatchs[0].supplierName);
            form.setValue("receiverName", selectedMedicineBatchs[0].contactPerson);
            form.setValue("receiverEmail", selectedMedicineBatchs[0].email);
            form.setValue("receiverPhone", selectedMedicineBatchs[0].phoneNumber);
        }
    }, [open, selectedMedicineBatchs]);
    return (
        <>
            <DynamicForm form={form}>
                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <Dialog.Header title={t(i18n.translationKey.createExpiredReturn)} onClose={handleClose} />

                    <Dialog.Body className="space-y-6 bg-slate-50 p-6 !pt-4">
                        <Box className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                            <Typography variant="subtitle1" fontWeight={600} fontSize={18}>
                                {t(i18n.translationKey.expiredReturnInformation)}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <FormItem
                                        render="text-input"
                                        name="returnCode"
                                        required
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                        label={t(i18n.translationKey.returnCode)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="receiverSupplier"
                                        required
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                        label={t(i18n.translationKey.supplierName)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="receiverName"
                                        required
                                        label={t(i18n.translationKey.contactPerson)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="receiverEmail"
                                        required
                                        pattern={EMAIL_PATTERN}
                                        label={t(i18n.translationKey.email)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="receiverPhone"
                                        required
                                        pattern={PHONE_NUMBER_PATTERN}
                                        label={t(i18n.translationKey.phoneNumber)}
                                    />
                                </Grid>

                                <Typography variant="subtitle1" fontWeight={600} fontSize={18} className="">
                                    {t(i18n.translationKey.pharmaceuticalInformation)}
                                </Typography>
                                <Grid size={12}>
                                    <AgDataGrid
                                        {...medicineBatchAgGrid}
                                        rowData={selectedMedicineBatchs}
                                        columnDefs={
                                            [
                                                {
                                                    field: "medicineName",
                                                    headerName: t(i18n.translationKey.medicineName),
                                                    cellClass: "ag-cell-center",
                                                },
                                                {
                                                    field: "batchNumber",
                                                    headerName: t(i18n.translationKey.batchNumber),
                                                    cellClass: "ag-cell-center",
                                                },
                                                {
                                                    field: "expiryDate",
                                                    headerName: t(i18n.translationKey.expiredDate),
                                                    cellClass: "ag-cell-center",
                                                },
                                                {
                                                    field: "currentQuantity",
                                                    headerName: t(i18n.translationKey.quantity),
                                                    cellClass: "ag-cell-center",
                                                },
                                            ] as ColDef<MedicineBatch>[]
                                        }
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        render="text-area"
                                        name="reason"
                                        label={t(i18n.translationKey.reason)}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Dialog.Body>

                    <Dialog.Action>
                        <Button onClick={handleClose}>{t(i18n.translationKey.cancel)}</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={() => {
                                if (!form.formState.isValid) {
                                    form.trigger();
                                    return;
                                }
                                setConfirmPasswordDialogOpen(true);
                            }}
                        >
                            {t(i18n.translationKey.create)}
                        </Button>
                    </Dialog.Action>
                </Dialog>

                <ConfirmPasswordDialog
                    open={isConfirmPasswordDialogOpen}
                    onClose={() => setConfirmPasswordDialogOpen(false)}
                    onConfirmed={() => {
                        form.handleSubmit(handleSubmit)();
                    }}
                />
            </DynamicForm>
        </>
    );
};
