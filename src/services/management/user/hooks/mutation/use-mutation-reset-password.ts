import { useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { authService } from "~/services/auth";

export const useMutationResetPassword = () => {
    return useMutation({
        mutationKey: [QueryKey.USER.RESET_PASSWORD],
        mutationFn: async (email: string) => {
            const response = await authService.resetPassword({
                email,
            });
            return response;
        },
        onSuccess: () => {
            showToast.success(i18n.t(i18n.translationKey.resetPasswordSuccessfully));
        },
    });
};
