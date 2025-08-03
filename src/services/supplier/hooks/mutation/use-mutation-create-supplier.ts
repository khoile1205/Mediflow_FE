import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { QueryKey } from "~/constants/query-key";
import { CreateSupplierRequest, supplierApi } from "../../infras";
import { SupplierFormValues } from "~/pages/supplier/types";

export const useMutationCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formValue: SupplierFormValues) => {
            const body: CreateSupplierRequest = {
                ...formValue,
            };
            return await supplierApi.createSupplier(body);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.SUPPLIER.GET_LIST_SUPPLIER],
            });
            showToast.success(i18n.t(i18n.translationKey.createSupplierSuccess));
        },
    });
};
