import { useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { inventoryApis } from "../../infras";

export const useMutationApproveExpiredForm = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.APPROVE_EXPIRED_FORM],
        mutationFn: ({ id, token }: { id: number; token: string }) => inventoryApis.approveExpiredForm(id, token),
        onSuccess: () => {
            showToast.success(i18n.translationKey.approveExpiredReturnFormSuccess);
        },
    });
};
