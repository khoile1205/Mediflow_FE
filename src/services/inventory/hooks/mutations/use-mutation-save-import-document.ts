import { useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { ImportMedicineFromSupplierDocumentRequest, inventoryApis } from "../../infras";

export const useMutationSaveImportDocument = () => {
    return useMutation({
        mutationFn: (data: ImportMedicineFromSupplierDocumentRequest) => inventoryApis.saveImportDocument(data),
        onSuccess: () => {
            showToast.success(i18n.t(i18n.translationKey.documentCreateSuccessfully));
        },
    });
};
