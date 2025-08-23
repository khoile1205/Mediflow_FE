import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "~/components/common/dialog";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { useQueryGetTransactionById } from "~/services/transaction-history/queries";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";
import { getPaymentMethod, getPaymentStatus } from "./utils";

interface TransactionHistoryDetailModalProps {
    open: boolean;
    onClose: () => void;
    transactionId?: number;
}
const TransactionHistoryDetailModal: React.FC<TransactionHistoryDetailModalProps> = ({
    open,
    onClose,
    transactionId,
}) => {
    const { t } = useTranslation();

    const { data: transaction, isLoading } = useQueryGetTransactionById(transactionId);

    if (!transactionId || !transaction || isLoading) return null;

    const { paymentDetails, payment } = transaction;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Dialog.Header title={t(i18n.translationKey.transactionDetail)} onClose={onClose} />

            <Dialog.Body className="space-y-6 bg-slate-50 p-6 !pt-4">
                {/* Payment Info */}
                <Box className="rounded-lg bg-white p-6 shadow-sm">
                    <Typography variant="subtitle1" fontWeight={600} fontSize={18} className="mb-4">
                        {t(i18n.translationKey.paymentInformation)}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography fontWeight={600}>{t(i18n.translationKey.invoiceNumber)}</Typography>
                            <Typography>{payment.invoiceNumber}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={600}>{t(i18n.translationKey.totalAmount)}</Typography>
                            <Typography color="primary" fontWeight={700}>
                                {formatCurrencyVND(payment.totalAmount)}
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={600}>{t(i18n.translationKey.paymentMethod)}</Typography>
                            <Typography>{getPaymentMethod(payment.method)}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={600}>{t(i18n.translationKey.paymentStatus)}</Typography>
                            <Typography>{getPaymentStatus(payment.status)}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={600}>{t(i18n.translationKey.createdAt)}</Typography>
                            <Typography>
                                {formatDate(payment.createdAt, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"])}
                            </Typography>
                        </Grid>
                        {payment.atmTransactionCode && (
                            <Grid size={6}>
                                <Typography fontWeight={600}>{t(i18n.translationKey.atmTransactionCode)}</Typography>
                                <Typography>{payment.atmTransactionCode}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {/* Patient Info */}
                <Box className="rounded-lg bg-white p-6 shadow-sm">
                    <Typography
                        variant="subtitle1"
                        textTransform="none"
                        fontWeight={600}
                        fontSize={18}
                        className="mb-4"
                    >
                        {t(i18n.translationKey.paymentDetails)}
                    </Typography>
                    {paymentDetails && paymentDetails.length > 0 ? (
                        <Box>
                            {paymentDetails.map((detail, index) => (
                                <Box key={detail.id} className="py-2">
                                    <Grid container spacing={2}>
                                        <Grid size={4}>
                                            <Typography fontWeight={600}>
                                                {t(i18n.translationKey.serviceCode)}
                                            </Typography>
                                            <Typography>{detail.serviceCode}</Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography fontWeight={600}>
                                                {t(i18n.translationKey.serviceName)}
                                            </Typography>
                                            <Typography>{detail.serviceName}</Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography fontWeight={600}>
                                                {t(i18n.translationKey.totalAmount)}
                                            </Typography>
                                            <Typography>{formatCurrencyVND(detail.amount)}</Typography>
                                        </Grid>
                                    </Grid>
                                    {index !== paymentDetails.length - 1 && <Divider className="my-2" />}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography>{t(i18n.translationKey.noData)}</Typography>
                    )}
                </Box>
            </Dialog.Body>
        </Dialog>
    );
};

export default TransactionHistoryDetailModal;
