import { Box, Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "~/components/common/dialog";
import DynamicForm from "~/components/form/dynamic-form";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { RejectVaccinationFormValues } from "./types";
import FormItem from "~/components/form/form-item";
import { useMutationRejectInjectVaccine } from "~/services/vaccination/hooks/mutations";

interface RejectVaccinationModalProps {
    receptionVaccinationId: number;
    open: boolean;
    onClose: () => void;
}
const RejectVaccinationModal: React.FC<RejectVaccinationModalProps> = ({ receptionVaccinationId, open, onClose }) => {
    const { t } = useTranslation();
    const form = useForm<RejectVaccinationFormValues>({
        defaultValues: {
            issueNote: "",
        },
    });
    const { mutateAsync: rejectInjectVaccine } = useMutationRejectInjectVaccine();

    const handleRejectVaccination = async (data: RejectVaccinationFormValues) => {
        await rejectInjectVaccine({
            receptionVaccinationId,
            issueNote: data.issueNote,
        });
        form.reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <Dialog.Header title={t(i18n.translationKey.rejectInjection)} />
            <Dialog.Body>
                <Box className="mt-3">
                    <DynamicForm form={form}>
                        <FormItem
                            name="issueNote"
                            render="text-area"
                            required
                            label={t(i18n.translationKey.issueNote)}
                        />
                    </DynamicForm>
                </Box>
            </Dialog.Body>
            <Dialog.Action>
                <Button onClick={onClose}>{t(i18n.translationKey.cancel)}</Button>
                <Button onClick={form.handleSubmit(handleRejectVaccination)}>{t(i18n.translationKey.confirm)}</Button>
            </Dialog.Action>
        </Dialog>
    );
};

export default RejectVaccinationModal;
