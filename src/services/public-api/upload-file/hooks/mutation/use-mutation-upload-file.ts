import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "~/constants/query-key";
import { uploadFileApi, UploadFileRequest, UploadedFile } from "../../infras";

export function useMutationUploadFile() {
    return useMutation({
        mutationKey: [QueryKey.UPLOAD_FILE.UPLOAD_FILE],
        mutationFn: async (request: UploadFileRequest) => {
            const response = await uploadFileApi.uploadFile(request);
            return response.Data;
        },
        onSuccess: (file: UploadedFile) => {
            return file;
        },
    });
}
