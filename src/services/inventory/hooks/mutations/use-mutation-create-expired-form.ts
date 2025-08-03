import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { inventoryApis } from "../../infras";
import { ExpiredReturnFormValues } from "~/pages/pharmacy/expired-return-form/types";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";

export const useMutationCreateExpiredForm = () => {
    return useMutation({
        mutationKey: [QueryKey.INVENTORY.CREATE_EXPIRED_FORM],
        mutationFn: (data: ExpiredReturnFormValues) => inventoryApis.createExpiredReturn(data),
        onSuccess: () => {
            showToast.success(i18n.t(i18n.translationKey.createExpiredReturnFormSuccess));
        },
    });
};
