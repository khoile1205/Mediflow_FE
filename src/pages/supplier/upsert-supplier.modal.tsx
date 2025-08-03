import { Delete } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "~/components/common/dialog";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import { EMAIL_PATTERN, PHONE_NUMBER_PATTERN } from "~/components/form/validation/pattern";
import i18n from "~/configs/i18n";
import { UploadedFileType } from "~/constants/enums";
import { useAuth } from "~/contexts/auth.context";
import { useMutationDeleteFile, useMutationUploadFile } from "~/services/public-api/upload-file/hooks/mutation";
import { ConfirmPasswordDialog } from "../management/medicine/ConfirmPasswordDialog";
import { SupplierFormValues } from "./types";
import { Supplier } from "~/entities";
import { UploadedFile } from "~/services/public-api/upload-file/infras";
import { useMutationCreateSupplier, useMutationUpdateSupplier } from "~/services/supplier/hooks/mutation";

type CreateSupplierModalProps = {
    mode: "create";
    open: boolean;
    onClose: () => void;
};

type EditSupplierModalProps = {
    mode: "edit";
    open: boolean;
    onClose: () => void;
    supplier: Supplier;
};

type UpsertSupplierModalProps = CreateSupplierModalProps | EditSupplierModalProps;

export const UpsertSupplierModal: React.FC<UpsertSupplierModalProps> = ({ open, onClose, mode, ...props }) => {
    const { t } = useTranslation();
    const { userPermission } = useAuth();

    const { mutateAsync: uploadFile } = useMutationUploadFile();
    const { mutateAsync: deleteFile } = useMutationDeleteFile();
    const { mutateAsync: createSupplier } = useMutationCreateSupplier();
    const { mutateAsync: updateSupplier } = useMutationUpdateSupplier();

    const [isConfirmPasswordDialogOpen, setConfirmPasswordDialogOpen] = React.useState<boolean>(false);

    const form = useForm<SupplierFormValues>({
        defaultValues: {
            supplierName: "",
            contactPerson: "",
            phone: "",
            email: "",
            address: "",
            contracts: [],
            expiredDate: undefined,
            director: "",
            fax: "",
            taxCode: "",
        },
    });

    const handleSubmit = async (data: SupplierFormValues) => {
        if (mode === "edit" && "supplier" in props) {
            await updateSupplier({ formValue: data, id: props.supplier.id });
        } else {
            // Handle create logic here
            await createSupplier(data);
        }
        onClose();
    };

    const handleClose = () => {
        onClose();
        form.reset();
    };

    React.useEffect(() => {
        if (open) {
            if (mode === "edit" && "supplier" in props) {
                form.setValue("supplierName", props.supplier.supplierName);
                form.setValue("contactPerson", props.supplier.contactPerson);
                form.setValue("phone", props.supplier.phone);
                form.setValue("email", props.supplier.email);
                form.setValue("address", props.supplier.address);
                form.setValue("expiredDate", props.supplier.expiredDate);
                form.setValue("director", props.supplier.director);
                form.setValue("fax", props.supplier.fax);
                form.setValue("taxCode", props.supplier.taxCode);
                form.setValue("contracts", (props.supplier.contracts as UploadedFile[]) || []);
            } else {
                form.reset();
            }
        }
    }, [mode, open]);

    return (
        <>
            <DynamicForm form={form}>
                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <Dialog.Header
                        title={
                            mode === "edit"
                                ? t(i18n.translationKey.editSupplier)
                                : t(i18n.translationKey.createNewSupplier)
                        }
                        onClose={handleClose}
                    />

                    <Dialog.Body className="space-y-6 bg-slate-50 p-6 !pt-4">
                        <Box className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                            {/* Contact Information */}
                            <Typography variant="subtitle1" fontWeight={600} fontSize={18}>
                                {t(i18n.translationKey.contactInformation)}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="supplierName"
                                        required
                                        label={t(i18n.translationKey.supplierName)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="contactPerson"
                                        required
                                        label={t(i18n.translationKey.contactPerson)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="phone"
                                        required
                                        pattern={PHONE_NUMBER_PATTERN}
                                        label={t(i18n.translationKey.phoneNumber)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="email"
                                        required
                                        pattern={EMAIL_PATTERN}
                                        label={t(i18n.translationKey.email)}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormItem
                                        render="text-area"
                                        name="address"
                                        required
                                        label={t(i18n.translationKey.address)}
                                    />
                                </Grid>
                            </Grid>

                            {/* Registration Information */}
                            <Typography variant="subtitle1" fontWeight={600} fontSize={18} className="mt-4">
                                {t(i18n.translationKey.registrationInformation)}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <FormItem
                                        render="date-picker"
                                        name="expiredDate"
                                        required
                                        label={t(i18n.translationKey.expiredDate)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="director"
                                        label={t(i18n.translationKey.director)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem render="text-input" name="fax" label={t(i18n.translationKey.fax)} />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="taxCode"
                                        label={t(i18n.translationKey.taxCode)}
                                    />
                                </Grid>
                            </Grid>

                            {/* Additional Information */}
                            <Typography variant="subtitle1" fontWeight={600} fontSize={18} className="mt-4">
                                {t(i18n.translationKey.documents)}
                            </Typography>
                            <FormItem
                                render="file-upload"
                                name="documents"
                                multiple
                                required
                                label={t(i18n.translationKey.documents)}
                                accept={{
                                    "application/pdf": [".pdf"],
                                    "application/msword": [".doc"],
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                                        ".docx",
                                    ],
                                }}
                                maxFiles={20}
                                maxFileSize={10}
                                onDelete={async (file) => {
                                    await deleteFile(file.id);
                                }}
                                onUpload={async (file: File) => {
                                    return await uploadFile({
                                        file,
                                        department: userPermission.departments[0] ?? "",
                                        type: UploadedFileType.REPORT,
                                    });
                                }}
                                renderFile={(file, index, onDelete) => (
                                    <ListItem
                                        key={index}
                                        className="mb-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                                        secondaryAction={
                                            <IconButton size="small" onClick={onDelete}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={file.fileName}
                                            slotProps={{
                                                primary: { variant: "body1", fontWeight: 500 },
                                            }}
                                        />
                                    </ListItem>
                                )}
                            />
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
                            {mode === "edit" ? t(i18n.translationKey.update) : t(i18n.translationKey.create)}
                        </Button>
                    </Dialog.Action>
                </Dialog>

                <ConfirmPasswordDialog
                    open={isConfirmPasswordDialogOpen}
                    onClose={() => setConfirmPasswordDialogOpen(false)}
                    onConfirmed={() => {
                        form.handleSubmit(handleSubmit)();
                        setConfirmPasswordDialogOpen(false);
                    }}
                />
            </DynamicForm>
        </>
    );
};
