import { useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { inventoryApis } from "../../infras";

export const useMutationRejectExpiredForm = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.REJECT_EXPIRED_FORM],
        mutationFn: ({ id, token }: { id: number; token: string }) => inventoryApis.rejectExpiredForm(id, token),
        onSuccess: () => {
            showToast.success(i18n.translationKey.rejectExpiredReturnFormSuccess);
        },
    });
};
