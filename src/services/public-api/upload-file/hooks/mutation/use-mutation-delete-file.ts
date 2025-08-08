import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { uploadFileApi } from "../../infras";

export function useMutationDeleteFile() {
    return useMutation({
        mutationKey: [QueryKey.UPLOAD_FILE.DELETE_FILE],
        mutationFn: async (fileId: string) => {
            const response = await uploadFileApi.deleteFile(fileId);
            return response.Data;
        },
        onSuccess: (status) => {
            return status;
        },
    });
}
