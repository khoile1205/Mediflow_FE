import DescriptionIcon from "@mui/icons-material/Description";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { Dialog } from "~/components/common/dialog";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { MedicineBatch, MedicineBatchExpiredReturnDetail } from "~/entities";
import { useQueryGetMedicineBatchReturnFormDetail } from "~/services/inventory/hooks/queries";
import { formatDate } from "~/utils/date-time";
import { ExpiredReturnStatus } from "./components/ExpiredFormStatusLabel";

interface ExpiredReturnDetailModalProps {
    open: boolean;
    onClose: () => void;
    expiredReturnId: number;
}

export const ExpiredReturnDetailModal: React.FC<ExpiredReturnDetailModalProps> = ({
    open,
    onClose,
    expiredReturnId,
}) => {
    const { t } = useTranslation();
    const medicineBatchAgGrid = useAgGrid<MedicineBatch>({});

    const { data: expiredReturn } = useQueryGetMedicineBatchReturnFormDetail(expiredReturnId);

    if (!expiredReturn) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Dialog.Header title={t(i18n.translationKey.expiredReturnFormDetail)} onClose={onClose} />

            <Dialog.Body className="space-y-6 bg-slate-50 p-6 !pt-4">
                {/* SUMMARY SECTION */}
                <Paper className="rounded-lg p-4 shadow-sm">
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                {t(i18n.translationKey.returnCode)}
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                                {expiredReturn.returnCode}
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                {t(i18n.translationKey.status)}
                            </Typography>
                            <ExpiredReturnStatus status={expiredReturn.status} />
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                {t(i18n.translationKey.createdDate)}
                            </Typography>
                            <Typography fontWeight={500}>
                                {formatDate(expiredReturn.createdAt, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"])}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* SUPPLIER SECTION */}
                <Paper className="rounded-lg p-4 shadow-sm">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <LocalShippingIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            {t(i18n.translationKey.supplierInformation)}
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                {t(i18n.translationKey.supplierName)}
                            </Typography>
                            <Typography fontWeight={500}>{expiredReturn.details[0].supplierName}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                {t(i18n.translationKey.contactPerson)}
                            </Typography>
                            <Typography fontWeight={500}>{expiredReturn.receiverName}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                {t(i18n.translationKey.email)}
                            </Typography>
                            <Chip label={expiredReturn.receiverEmail} color="primary" variant="outlined" size="small" />
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="text.secondary">
                                {t(i18n.translationKey.phoneNumber)}
                            </Typography>
                            <Chip
                                label={expiredReturn.receiverPhone}
                                color="secondary"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* MEDICINE SECTION */}
                <Paper className="rounded-lg p-4 shadow-sm">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Inventory2Icon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            {t(i18n.translationKey.pharmaceuticalInformation)}
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <AgDataGrid
                        {...medicineBatchAgGrid}
                        rowData={expiredReturn.details}
                        columnDefs={
                            [
                                {
                                    field: "batchNumber",
                                    headerName: t(i18n.translationKey.batchNumber),
                                    cellClass: "ag-cell-center",
                                },
                                {
                                    field: "expirationDate",
                                    headerName: t(i18n.translationKey.expiredDate),
                                    cellClass: "ag-cell-center",
                                    valueFormatter: (params) =>
                                        formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                                },
                                {
                                    field: "quantity",
                                    headerName: t(i18n.translationKey.quantity),
                                    cellClass: "ag-cell-center",
                                },
                            ] as ColDef<MedicineBatchExpiredReturnDetail>[]
                        }
                    />
                </Paper>

                {/* REASON SECTION */}
                <Paper className="rounded-lg p-4 shadow-sm">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <DescriptionIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            {t(i18n.translationKey.reason)}
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 1 }} />

                    <Typography fontWeight={500}>
                        {expiredReturn.reason || t(i18n.translationKey.noReasonProvided)}
                    </Typography>
                </Paper>
            </Dialog.Body>

            <Dialog.Action>
                <Button variant="outlined" onClick={onClose}>
                    {t(i18n.translationKey.close)}
                </Button>
            </Dialog.Action>
        </Dialog>
    );
};
