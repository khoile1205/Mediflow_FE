export interface UploadFileRequest {
    file: File;
    department: string;
    type: string;
}

export interface UploadedFile {
    id: string;
    fileName: string;
    contentType: string;
    size: number;
    storagePath: string;
    department: string;
    createdAt: Date;
    lastUpdatedAt: Date;
}
