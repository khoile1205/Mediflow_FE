import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ConfirmPasswordRequest, ConfirmPasswordResponse } from "../types";
import { IBaseApiResponse } from "~/libs/axios/types";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";
import { authenticationApi } from "../infras/authentication.api";

export const useMutationConfirmPassword = () => {
    const { t } = useTranslation();

    return useMutation<IBaseApiResponse<ConfirmPasswordResponse>, Error, ConfirmPasswordRequest>({
        mutationFn: (payload) => authenticationApi.confirmPassword(payload),
        onSuccess: (res) => {
            if (res.Data?.isSuccess) {
                showToast.success(t(i18n.translationKey.passwordConfirmSuccess));
            } else {
                showToast.error(res?.Data?.message ?? t(i18n.translationKey.passwordIncorrect));
            }
        },
        onError: () => {
            showToast.error(t(i18n.translationKey.passwordConfirmFailed));
        },
    });
};
