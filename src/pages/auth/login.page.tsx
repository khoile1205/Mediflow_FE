import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import AppLogo from "~/assets/images/logo.png";
import BackgroundLogin from "~/assets/images/bg_login.png";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import { ChangeLanguageTab } from "~/components/layout/sidebar/tabs/change-lang.tab";
import i18n from "~/configs/i18n";
import { useAuth } from "~/contexts/auth.context";
import { TLoginRequest } from "~/services/auth/types";

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const { login, isLoading } = useAuth();

    const form = useForm<TLoginRequest>();

    const handleSubmit = async (value: TLoginRequest) => {
        await login(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !form.formState.isSubmitting) {
            form.handleSubmit(handleSubmit)();
        }
    };

    return (
        <Box className="flex h-screen w-screen">
            <Box sx={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
                <ChangeLanguageTab
                    popOverAnchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                />
            </Box>
            <Box className="hidden basis-0 md:block md:basis-1/2 2xl:basis-3/4">
                <img src={BackgroundLogin} className="h-full w-full object-cover" />
            </Box>
            <Box className="my-auto flex-1">
                <Box className="mx-12">
                    <Stack spacing={2} direction={"row"} className="items-center">
                        <img src={AppLogo} className="object-cover" />
                        <Typography className="text-[16px] font-bold">MediFlow</Typography>
                    </Stack>
                    <Typography className="pb-6 pt-5 text-xl font-bold">{t(i18n.translationKey.login)}</Typography>
                    <DynamicForm form={form} onSubmit={handleSubmit}>
                        <Stack spacing={2} className="mb-8">
                            <FormItem
                                render="text-input"
                                name="userName"
                                label={t(i18n.translationKey.username)}
                                placeholder={t(i18n.translationKey.username)}
                                required
                                onKeyDown={handleKeyDown}
                            />
                            <FormItem
                                render="text-input"
                                name="password"
                                label={t(i18n.translationKey.password)}
                                placeholder={t(i18n.translationKey.password)}
                                isPassword
                                required
                                onKeyDown={handleKeyDown}
                            />
                        </Stack>
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                            className="!py-3"
                            disabled={isLoading || form.formState.isSubmitting}
                        >
                            <Typography className="text-[16px] text-base font-bold">
                                {t(i18n.translationKey.login)}
                            </Typography>
                        </Button>
                    </DynamicForm>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;
