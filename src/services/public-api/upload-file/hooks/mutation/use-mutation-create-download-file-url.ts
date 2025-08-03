import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { uploadFileApi } from "../../infras";

export function useMutationCreateDownloadFileUrl() {
    return useMutation({
        mutationKey: [QueryKey.UPLOAD_FILE.CREATE_DOWNLOAD_URL],
        mutationFn: async (fileId: string) => {
            const response = await uploadFileApi.createDownloadUrl(fileId);
            return response.Data;
        },
        onSuccess: (fileUrl: string) => {
            return fileUrl;
        },
    });
}
