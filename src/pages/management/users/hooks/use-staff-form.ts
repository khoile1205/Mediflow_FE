import { useForm } from "~/components/form/hooks/use-form";
import { StaffFormValues } from "../types";
import { t } from "i18next";
import i18n from "~/configs/i18n";

export const useStaffForm = () => {
    const staffForm = useForm<StaffFormValues>({
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

    staffForm.register("confirmPassword", {
        validate: (value) => value === staffForm.watch("password") || t(i18n.translationKey.passwordMismatch),
    });

    return staffForm;
};
