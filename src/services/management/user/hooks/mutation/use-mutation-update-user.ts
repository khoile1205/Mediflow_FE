import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { StaffFormValues } from "~/pages/management/users/types";
import { showToast } from "~/utils";
import { userApis } from "../../infras";

export const useMutationUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.USER.UPDATE_USER],
        mutationFn: async (payload: StaffFormValues) => {
            const response = await userApis.updateUser(payload);
            return response;
        },
        onSuccess: (_response, payload) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.USER.GET_LIST_USERS_WITH_PAGINATION],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.USER.GET_USER_BY_ID, payload.id],
            });
            showToast.success(i18n.t(i18n.translationKey.updateUserSuccessfully));
        },
    });
};
