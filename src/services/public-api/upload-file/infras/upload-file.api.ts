import { callApi } from "~/libs/axios/request";
import { UploadedFile, UploadFileRequest } from "./types";
import { HttpMethod } from "~/libs/axios/types";
import { endpoints } from "~/constants/endpoints";

const uploadFile = (request: UploadFileRequest) => {
    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("department", request.department);
    formData.append("type", request.type);

    return callApi<UploadedFile>({
        method: HttpMethod.POST,
        url: endpoints.uploadFile.uploadFile,
        data: formData,
    });
};

const createDownloadUrl = (fileId: string) => {
    return callApi<string>({
        method: HttpMethod.POST,
        url: endpoints.uploadFile.createDownloadUrl(fileId),
        data: null,
    });
};

const deleteFile = (fileId: string) => {
    return callApi<boolean>({
        method: HttpMethod.DELETE,
        url: endpoints.uploadFile.deleteFileById(fileId),
    });
};

export const uploadFileApi = {
    uploadFile,
    createDownloadUrl,
    deleteFile,
};
