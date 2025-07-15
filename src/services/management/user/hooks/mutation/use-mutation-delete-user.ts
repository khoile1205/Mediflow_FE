import { useQueryClient, useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { userApis } from "../../infras";

export const useMutationDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.USER.DELETE_USER],
        mutationFn: async (userId: number) => {
            const response = await userApis.deleteUser(userId);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.USER.GET_LIST_USERS_WITH_PAGINATION],
            });
            showToast.success(i18n.t(i18n.translationKey.deleteUserSuccessfully));
        },
    });
};
