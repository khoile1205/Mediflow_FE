import { useForm } from "~/components/form/hooks/use-form";
import { UserFormValues } from "../types";
import { t } from "i18next";
import i18n from "~/configs/i18n";

export const useUserForm = () => {
    const userForm = useForm<UserFormValues>({
        defaultValues: {
            id: null,
            code: "",
            name: "",
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            address: "",
            profilePictureUrl: "",
            roleNames: [],
            departmentIds: [],
            isSuspended: false,
        },
    });

    userForm.register("confirmPassword", {
        validate: (value) => value === userForm.watch("password") || t(i18n.translationKey.passwordMismatch),
    });

    return userForm;
};
