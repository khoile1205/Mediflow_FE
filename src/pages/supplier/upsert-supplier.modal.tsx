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
import { usePasswordConfirm } from "~/contexts/password-confirmation.context";
import { useMutationDeleteFile, useMutationUploadFile } from "~/services/public-api/upload-file/hooks/mutation";
import { UploadedFile } from "~/services/public-api/upload-file/infras";
import { useMutationCreateSupplier, useMutationUpdateSupplier } from "~/services/supplier/hooks/mutation";
import { useQueryGetSupplierById } from "~/services/supplier/hooks/queries";
import { SupplierFormValues } from "./types";

type CreateSupplierModalProps = {
    mode: "create";
    open: boolean;
    onClose: () => void;
};

type EditSupplierModalProps = {
    mode: "edit";
    open: boolean;
    onClose: () => void;
    supplierId?: number;
};

type UpsertSupplierModalProps = CreateSupplierModalProps | EditSupplierModalProps;

export const UpsertSupplierModal: React.FC<UpsertSupplierModalProps> = ({ open, onClose, mode, ...props }) => {
    const { t } = useTranslation();
    const { userPermission } = useAuth();
    const { requestPasswordConfirmation } = usePasswordConfirm();

    const { mutateAsync: uploadFile } = useMutationUploadFile();
    const { mutateAsync: deleteFile } = useMutationDeleteFile();
    const { mutateAsync: createSupplier } = useMutationCreateSupplier();
    const { mutateAsync: updateSupplier } = useMutationUpdateSupplier();

    const { data: supplier } = useQueryGetSupplierById(
        "supplierId" in props && mode === "edit" ? props.supplierId : undefined,
    );

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
        if (mode === "edit" && "supplierId" in props) {
            await updateSupplier({ formValue: data, id: props.supplierId });
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
            if (mode === "edit" && "supplierId" in props) {
                form.setValue("supplierName", supplier?.supplierName);
                form.setValue("contactPerson", supplier?.contactPerson);
                form.setValue("phone", supplier?.phone);
                form.setValue("email", supplier?.email);
                form.setValue("address", supplier?.address);
                form.setValue("expiredDate", supplier?.expiredDate);
                form.setValue("director", supplier?.director);
                form.setValue("fax", supplier?.fax);
                form.setValue("taxCode", supplier?.taxCode);
                form.setValue("contracts", (supplier?.contracts as UploadedFile[]) || []);
            } else {
                form.reset();
            }
        }
    }, [mode, open, supplier]);

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
                                        required
                                        label={t(i18n.translationKey.director)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="fax"
                                        label={t(i18n.translationKey.fax)}
                                        required
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="taxCode"
                                        required
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
                                name="contracts"
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
                                requestPasswordConfirmation(() => {
                                    form.handleSubmit(handleSubmit)();
                                });
                            }}
                        >
                            {mode === "edit" ? t(i18n.translationKey.update) : t(i18n.translationKey.create)}
                        </Button>
                    </Dialog.Action>
                </Dialog>
            </DynamicForm>
        </>
    );
};
