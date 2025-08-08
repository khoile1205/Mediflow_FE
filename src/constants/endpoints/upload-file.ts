const uploadFilePrefix = "/file-storage/files";

export const uploadFileEndpoints = {
    uploadFile: `${uploadFilePrefix}/upload`,
    getFileById: (id: string) => `${uploadFilePrefix}/${id}`,
    deleteFileById: (id: string) => `${uploadFilePrefix}/${id}`,
    createDownloadUrl: (id: string) => `${uploadFilePrefix}/${id}/download`,
};
