import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import BackgroundLogin from "~/assets/images/bg_login.png";
import AppLogo from "~/assets/images/app_logo.png";
import FormItem from "~/components/form/form-item";
import { useAuth, LoginParams } from "~/contexts/auth.context";
import DynamicForm from "~/components/form/dynamic-form";
import { useForm } from "~/components/form/hooks/use-form";

const LoginPage: React.FC = () => {
    const { login } = useAuth();

    const form = useForm<LoginParams>();

    const handleSubmit = async (value: LoginParams) => {
        await login(value);
    };

    return (
        <Box className="flex h-screen w-screen">
            <Box className="hidden basis-0 md:block md:basis-1/2 2xl:basis-3/4">
                <img src={BackgroundLogin} className="h-full w-full object-cover" />
            </Box>
            <Box className="my-auto flex-1">
                <Box className="mx-12">
                    <Stack spacing={2} direction={"row"} className="items-center">
                        <img src={AppLogo} className="object-cover" />
                        <Typography className="text-[16px] font-bold">MediFlow</Typography>
                    </Stack>
                    <Typography className="pb-6 pt-5 text-xl font-bold">Đăng nhập</Typography>
                    <DynamicForm form={form} onSubmit={handleSubmit}>
                        <Stack spacing={2} className="mb-8">
                            <FormItem render="text-input" name="userName" placeholder="Tài khoản" required />
                            <FormItem render="text-input" name="password" placeholder="Mật khẩu" isPassword required />
                        </Stack>
                        <Button variant="contained" fullWidth type="submit" className="!py-3">
                            <Typography className="text-[16px] text-base font-bold">Đăng nhập</Typography>
                        </Button>
                    </DynamicForm>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;
