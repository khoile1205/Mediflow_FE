import { Download } from "@mui/icons-material";
import { Box, Grid, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "~/components/common/dialog";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { useMutationCreateDownloadFileUrl } from "~/services/public-api/upload-file/hooks/mutation";
import { formatDate } from "~/utils/date-time";
import { SupplierStatusLabel } from "./components";
import { Supplier } from "~/entities";

interface SupplierDetailsModalProps {
    open: boolean;
    onClose: () => void;
    supplier?: Supplier;
}
export const SupplierDetailsModal: React.FC<SupplierDetailsModalProps> = ({ open, onClose, supplier }) => {
    const { t } = useTranslation();
    const { mutate: createDownloadUrl } = useMutationCreateDownloadFileUrl();

    const handleDownload = (fileId: string) => {
        createDownloadUrl(fileId, {
            onSuccess: (fileUrl) => {
                const link = document.createElement("a");
                link.href = fileUrl;
                link.setAttribute("download", ""); // Set the download attribute
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
        });
    };

    if (!supplier) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Dialog.Header title={t(i18n.translationKey.supplierDetail)} onClose={onClose} />

            <Dialog.Body className="space-y-6 bg-slate-50 p-6 !pt-4">
                {/* Supplier Info */}
                <Box className="rounded-lg bg-white p-6 shadow-sm">
                    <Grid container spacing={2}>
                        <Grid container size={12} alignItems="center" className="mb-2">
                            <Grid size={6} className="flex items-center">
                                <Typography variant="body2" fontWeight={600} fontSize={16} className="mr-2">
                                    {t(i18n.translationKey.supplierCode)}
                                </Typography>
                                <Typography variant="body2" fontSize={16}>
                                    {supplier.supplierCode}
                                </Typography>
                            </Grid>
                            <Grid size={6} className="flex items-center justify-end">
                                <Typography variant="body2" fontWeight={600} fontSize={16} className="mr-2">
                                    {t(i18n.translationKey.status)}
                                </Typography>
                                <SupplierStatusLabel expiredAt={supplier.expiredDate} />
                            </Grid>
                        </Grid>

                        <Grid size={12} className="">
                            <Typography variant="body2" fontWeight={600} fontSize={16} className="mr-2">
                                {t(i18n.translationKey.supplierName)}
                            </Typography>
                            <Typography variant="body2" fontSize={16}>
                                {supplier.supplierName}
                            </Typography>
                        </Grid>

                        {/* Contact Info */}
                        <Grid size={12} className="mt-4">
                            <Typography variant="subtitle1" fontWeight={600} className="mb-2" fontSize={18}>
                                {t(i18n.translationKey.contactInformation)}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.contactPerson)}
                                    </Typography>
                                    <Typography variant="body2">{supplier.contactPerson}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.director)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {supplier.director || t(i18n.translationKey.notAvailable)}
                                    </Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.phoneNumber)}
                                    </Typography>
                                    <Typography variant="body2">{supplier.phone}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.email)}
                                    </Typography>
                                    <Typography variant="body2">{supplier.email}</Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.address)}
                                    </Typography>
                                    <Typography variant="body2">{supplier.address}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Registration Info */}
                        <Grid size={12} className="mt-4">
                            <Typography variant="subtitle1" fontWeight={600} className="mb-2" fontSize={18}>
                                {t(i18n.translationKey.registrationInformation)}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.registrationDate)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(supplier.createdAt, DATE_TIME_FORMAT["dd/MM/yyyy"])}
                                    </Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.expiredDate)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(supplier.expiredDate, DATE_TIME_FORMAT["dd/MM/yyyy"])}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Additional Info */}
                        <Grid size={12} className="mt-4">
                            <Typography variant="subtitle1" fontWeight={600} className="mb-2" fontSize={18}>
                                {t(i18n.translationKey.additionalInformation)}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.fax)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {supplier.fax || t(i18n.translationKey.notAvailable)}
                                    </Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {t(i18n.translationKey.taxCode)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {supplier.taxCode || t(i18n.translationKey.notAvailable)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                {/* Documents Section */}
                <Box className="rounded-lg bg-white p-6 shadow-sm">
                    <Typography variant="subtitle1" className="mb-3" fontWeight={600} fontSize={18}>
                        {t(i18n.translationKey.documents)}
                    </Typography>
                    <List disablePadding>
                        <ListItem
                            className="mb-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            secondaryAction={
                                <Tooltip title={t(i18n.translationKey.download)}>
                                    <IconButton size="small">
                                        <Download fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemText
                                primary="Supplier_Contract_MediPharma_Supplies_2025.pdf"
                                slotProps={{
                                    primary: { variant: "body1", fontWeight: 500 },
                                }}
                            />
                        </ListItem>

                        <ListItem
                            className="mb-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            secondaryAction={
                                <Tooltip title={t(i18n.translationKey.download)}>
                                    <IconButton size="small">
                                        <Download fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemText
                                primary="Purchase_Agreement_MediPharma_Supplies_2025.docx"
                                slotProps={{
                                    primary: { variant: "body1", fontWeight: 500 },
                                }}
                            />
                        </ListItem>

                        <ListItem
                            className="mb-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            secondaryAction={
                                <Tooltip title={t(i18n.translationKey.download)}>
                                    <IconButton size="small">
                                        <Download fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemText
                                primary="Service_Contract_MediPharma_Supplies_2025.pdf"
                                slotProps={{
                                    primary: { variant: "body1", fontWeight: 500 },
                                }}
                            />
                        </ListItem>

                        {supplier.contracts?.map((document) => (
                            <ListItem
                                className="mb-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                                // divider
                                secondaryAction={
                                    <Tooltip title={t(i18n.translationKey.download)}>
                                        <IconButton size="small" onClick={() => handleDownload(document.id)}>
                                            <Download fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemText
                                    primary={document.fileName}
                                    slotProps={{
                                        primary: { variant: "body1", fontWeight: 500 },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Dialog.Body>
        </Dialog>
    );
};
