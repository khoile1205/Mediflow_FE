import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { SupplierFormValues } from "~/pages/supplier/types";
import { showToast } from "~/utils";
import { supplierApi, UpdateSupplierRequest } from "../../infras";

export const useMutationUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formValue }: { id: number; formValue: SupplierFormValues }) => {
            const body: UpdateSupplierRequest = {
                id,
                ...formValue,
            };
            return await supplierApi.updateSupplier(id, body);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.SUPPLIER.GET_LIST_SUPPLIER],
            });
            showToast.success(i18n.t(i18n.translationKey.updateSupplierSuccess));
        },
    });
};
