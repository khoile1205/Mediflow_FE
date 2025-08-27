import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { SupplierFormValues } from "~/pages/supplier/types";
import { showToast } from "~/utils";
import { supplierApi, UpdateSupplierRequest } from "../../infras";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { formatDate } from "~/utils/date-time";

export const useMutationUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formValue }: { id: number; formValue: SupplierFormValues }) => {
            const body: UpdateSupplierRequest = {
                id,
                ...formValue,
                expiredDate: formatDate(formValue.expiredDate, DATE_TIME_FORMAT["yyyy-MM-dd"]),
                contracts: formValue.contracts?.map((file) => ({
                    id: file.id,
                    fileName: file.fileName,
                })),
            };
            return await supplierApi.updateSupplier(id, body);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.SUPPLIER.GET_LIST_SUPPLIER],
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKey.SUPPLIER.GET_SUPPLIER_BY_ID, variables.id],
            });
            showToast.success(i18n.t(i18n.translationKey.updateSupplierSuccess));
        },
    });
};
