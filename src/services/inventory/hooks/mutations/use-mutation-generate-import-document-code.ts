import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { IDocumentImportMedicineSupplierResponse, inventoryApis } from "../../infras";

export function useMutationGenerateImportDocumentCode() {
    return useMutation<IDocumentImportMedicineSupplierResponse>({
        mutationKey: [QueryKey.INVENTORY.GENERATE_DOCUMENT_CODE],
        mutationFn: async () => {
            const response = await inventoryApis.generateDocumentCode();
            return response.Data;
        },
        onSuccess: (data: IDocumentImportMedicineSupplierResponse) => {
            return data;
        },
    });
}
