import { useMutation } from "@tanstack/react-query";
import { ImportMedicineFromSupplierDocumentRequest, inventoryApis } from "../../infras";

export const useMutationSaveImportDocument = () => {
    return useMutation({
        mutationFn: (data: ImportMedicineFromSupplierDocumentRequest) => inventoryApis.saveImportDocument(data),
    });
};
