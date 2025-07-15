import { useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { UserFormValues } from "~/pages/management/users/types";
import { showToast } from "~/utils";
import { userApis } from "../../infras";

export const useMutationCreateUser = () => {
    return useMutation({
        mutationKey: [QueryKey.USER.CREATE_USER],
        mutationFn: async (payload: UserFormValues) => {
            const response = await userApis.createUser(payload);
            return response;
        },
        onSuccess: () => {
            showToast.success(i18n.t(i18n.translationKey.createUserSuccessfully));
        },
    });
};
