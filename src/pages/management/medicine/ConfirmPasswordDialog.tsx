import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { useMutationConfirmPassword } from "~/services/auth/mutations/use-mutation-confirm-password";
import { useEffect, useState } from "react";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirmed: () => void;
}

export function ConfirmPasswordDialog({ open, onClose, onConfirmed }: Props) {
    const { t } = useTranslation();
    const form = useForm<{ password: string }>();
    const { mutate: confirmPassword, isPending } = useMutationConfirmPassword();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!open) {
            form.reset();
            form.clearErrors();
        }
    }, [open, form]);

    const handleConfirm = (data: { password: string }) => {
        confirmPassword(
            { password: data.password },
            {
                onSuccess: (res) => {
                    if (res?.Data?.isSuccess) {
                        onConfirmed();
                        form.reset();
                    } else {
                        form.setError("password", {
                            type: "manual",
                            message: t(i18n.translationKey.incorrectPassword),
                        });
                    }
                },
            },
        );
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t(i18n.translationKey.confirmPassword)}</DialogTitle>
            <DialogContent sx={{ p: 3, pt: 2 }}>
                <DynamicForm form={form}>
                    <Box mt={2}>
                        <FormItem
                            render="text-input"
                            name="password"
                            label={t(i18n.translationKey.password)}
                            isPassword
                            autoFocus
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </DynamicForm>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>{t(i18n.translationKey.cancel)}</Button>
                <Button onClick={form.handleSubmit(handleConfirm)} variant="contained" disabled={isPending}>
                    {t(i18n.translationKey.confirm)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
