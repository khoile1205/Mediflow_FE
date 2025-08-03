import { Delete, UploadFile } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { Accept, ErrorCode, useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { showToast } from "~/utils";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import { UploadedFile } from "~/services/public-api/upload-file/infras";

export type FileUploadFormItemProps = BaseFormItemProps & {
    multiple?: boolean;
    accept?: Accept;
    maxFiles?: number;
    maxFileSize?: number;
    renderFile?: (file: UploadedFile, index?: number, onDelete?: () => void) => React.ReactNode;
    onUpload: (files: File) => Promise<UploadedFile>;
    onDelete: (file: UploadedFile) => Promise<void>;
};

const DefaultFileUpload: React.FC<{ index: number; file: UploadedFile; onDelete: (index: number) => void }> = ({
    index,
    file,
    onDelete,
}) => {
    return (
        <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                px: 2,
                py: 0.5,
                mt: 1,
            }}
        >
            <Typography variant="body2">{file.fileName}</Typography>
            <Box ml={2}>
                <Typography variant="caption" sx={{ color: "gray", ml: 1 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                <IconButton size="small" onClick={() => onDelete(index)}>
                    <Delete fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
};

export const FileUploadFormItem: React.FC<FileUploadFormItemProps> = ({
    name,
    defaultValue,
    label,
    placeholder = i18n.translationKey.dragAndDropUpload,
    multiple = true,
    accept,
    maxFileSize = 5, // in MB
    maxFiles = 5,
    required,
    disabled,
    renderFile,
    onUpload,
    onDelete,
}) => {
    const { t } = useTranslation();

    const { setValue, getValues } = useFormContext();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => onDrop(acceptedFiles),
        onDropRejected: (fileRejections) => {
            fileRejections.forEach((rejection) => {
                switch (rejection.errors[0].code) {
                    case ErrorCode.FileTooLarge:
                        showToast.error(
                            t(i18n.translationKey.fileSizeExceedsLimit, {
                                file_name: rejection.file.name,
                                file_size: maxFileSize,
                            }),
                        );
                        break;
                    case ErrorCode.FileInvalidType:
                        showToast.error(
                            t(i18n.translationKey.invalidFileFormat, {
                                file_name: rejection.file.name,
                            }),
                        );
                        break;
                    case ErrorCode.TooManyFiles:
                        showToast.error(
                            t(i18n.translationKey.maxFileLimitReached, {
                                max_file: maxFiles,
                            }),
                        );
                        break;
                    default:
                        break;
                }
            });
        },
        multiple,
        accept,
        maxFiles,
        disabled,
    });

    const onDrop = React.useCallback(
        async (acceptedFiles: File[]) => {
            const currentFiles = multiple ? (getValues(name) as UploadedFile[]) || [] : [];

            if (multiple && currentFiles.length + acceptedFiles.length > maxFiles) {
                showToast.error(
                    t(i18n.translationKey.maxFileLimitReached, {
                        max_file: maxFiles,
                    }),
                );
                return;
            }
            // Upload all files if onUpload is provided
            const uploadResults = onUpload ? await Promise.allSettled(acceptedFiles.map((file) => onUpload(file))) : [];

            // Filter only fulfilled uploads
            const successfulUploads = onUpload
                ? uploadResults
                      .filter((result): result is PromiseFulfilledResult<UploadedFile> => result.status === "fulfilled")
                      .map((result) => result.value)
                : (acceptedFiles as unknown as UploadedFile[]);

            const newFiles = multiple ? [...currentFiles, ...successfulUploads] : [successfulUploads[0] || null];

            setValue(name, newFiles, { shouldValidate: true, shouldDirty: true });
        },
        [multiple, name, setValue, getValues],
    );

    const handleDelete = async (deletedFile: UploadedFile) => {
        const files = getValues(name) as UploadedFile[];

        await onDelete(deletedFile);

        if (!multiple) {
            setValue(name, null, { shouldValidate: true, shouldDirty: true });
        } else {
            const updatedFiles = files.filter((file) => file.id !== deletedFile.id);
            setValue(name, updatedFiles, { shouldValidate: true, shouldDirty: true });
        }
    };
    return (
        <ControllerWrapper
            name={name}
            required={required}
            defaultValue={defaultValue ?? (multiple ? [] : null)}
            render={({ field, error }) => {
                const files = multiple
                    ? (field.value as UploadedFile[])
                    : field.value
                      ? [field.value as UploadedFile]
                      : [];

                return (
                    <Box className="w-full">
                        {files.length > 0 && (
                            <Box
                                mt={2}
                                sx={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    pr: 1,
                                }}
                            >
                                {files.map((file, index) =>
                                    renderFile ? (
                                        renderFile(file, index, () => handleDelete(file))
                                    ) : (
                                        <DefaultFileUpload
                                            key={index}
                                            index={index}
                                            file={file}
                                            onDelete={() => handleDelete(file)}
                                        />
                                    ),
                                )}
                            </Box>
                        )}
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: `2px dashed ${error ? "#f44336" : isDragActive ? "#aaa" : "#ccc"}`,
                                borderRadius: 2,
                                p: 4,
                                textAlign: "center",
                                backgroundColor: isDragActive ? "#f0f8ff" : "#f9fbfd",
                                cursor: disabled ? "not-allowed" : "pointer",
                                color: "#555",
                            }}
                        >
                            <input {...getInputProps()} />
                            <UploadFile />
                            <Typography variant="body2" color="textSecondary">
                                {t(placeholder, {
                                    max_file: maxFiles,
                                    max_file_size: maxFileSize,
                                })}
                            </Typography>
                        </Box>

                        <FormErrorMessage errorMessage={error} label={label} />
                    </Box>
                );
            }}
        />
    );
};
