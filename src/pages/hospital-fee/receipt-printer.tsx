import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import QRCode from "react-qrcode-logo";
import AppLogo from "~/assets/images/logo.png";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { PaymentType } from "~/constants/enums";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";
import { HospitalFeeFormValue, HospitalServiceItem } from "./types";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";

interface ReceiptPrinterProps {
    formValue: HospitalFeeFormValue;
    attachedHospitalFeeItems?: HospitalServiceItem[];
    qrCode?: string;
}

export const ReceiptPrinter = React.forwardRef<HTMLDivElement, ReceiptPrinterProps>(
    ({ formValue, attachedHospitalFeeItems, qrCode }, ref) => {
        const { t } = useTranslation();
        const { name, patientCode, dob, age, address, invoiceNumber, paidType, hospitalServiceItems = [] } = formValue;

        const formatPaidType = (type?: PaymentType) => {
            switch (type) {
                case PaymentType.CASH:
                    return t(i18n.translationKey.cash);
                case PaymentType.ATM:
                    return t(i18n.translationKey.atm);
                case PaymentType.TRANSFER:
                    return t(i18n.translationKey.transfer);
                default:
                    return t(i18n.translationKey.notAvailable);
            }
        };

        const total = [...hospitalServiceItems, ...attachedHospitalFeeItems].reduce(
            (acc, item) => acc + item.unitPrice * item.quantity,
            0,
        );

        return (
            <Box ref={ref} sx={{ padding: 2, height: "100%" }}>
                <Box className="border-b-2 border-gray-300 px-4">
                    <Box className="mb-2 flex items-start justify-between">
                        <Box className="flex items-center">
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {t(i18n.translationKey.mediflow)}
                                </Typography>
                                <Typography variant="body2">{t(i18n.translationKey.hospitalAddress)}</Typography>
                                <Typography variant="body2">{t(i18n.translationKey.hospitalPhone)}</Typography>
                            </Box>
                        </Box>
                        <Box textAlign="right">
                            <Typography variant="body2">
                                {t(i18n.translationKey.no)}: <strong>{invoiceNumber || "N/A"}</strong>
                            </Typography>
                            <Typography variant="body2">
                                {t(i18n.translationKey.date)}: {formatDate(new Date(), DATE_TIME_FORMAT["dd/MM/yyyy"])}
                            </Typography>
                            <Typography variant="body2">
                                {t(i18n.translationKey.time)}: {formatDate(new Date(), DATE_TIME_FORMAT["HH:mm:ss"])}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography className="uppercase" variant="h5" fontWeight="bold" align="center" mt={4}>
                        {t(i18n.translationKey.receiptTitle)}
                    </Typography>
                </Box>

                <Box mb={6}>
                    <Typography className="uppercase" variant="subtitle1" fontWeight="bold" gutterBottom>
                        {t(i18n.translationKey.patientInfo)}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography>
                                <strong>{t(i18n.translationKey.fullName)}:</strong> {name}
                            </Typography>
                            <Typography>
                                <strong>{t(i18n.translationKey.medicalCode)}:</strong> {patientCode}
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography>
                                <strong>{t(i18n.translationKey.dateOfBirth)}:</strong> {dob}
                            </Typography>
                            <Typography>
                                <strong>{t(i18n.translationKey.age)}:</strong> {age}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography>
                        <strong>{t(i18n.translationKey.address)}:</strong> {address}
                    </Typography>
                </Box>

                <Box mb={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {t(i18n.translationKey.paymentDetails)}
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                                <TableCell>{t(i18n.translationKey.content)}</TableCell>
                                <TableCell align="center">{t(i18n.translationKey.quantity)}</TableCell>
                                <TableCell align="right">{t(i18n.translationKey.unitPrice)}</TableCell>
                                <TableCell align="right">{t(i18n.translationKey.amountBeforeDiscount)}</TableCell>
                                <TableCell align="right">{t(i18n.translationKey.discountAmount)}</TableCell>
                                <TableCell align="right">{t(i18n.translationKey.amountAfterDiscount)}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...hospitalServiceItems, ...attachedHospitalFeeItems].map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{item.serviceName}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="right">{formatCurrencyVND(item.unitPrice)}</TableCell>
                                    <TableCell align="right">
                                        {formatCurrencyVND(item.unitPrice * item.quantity)}
                                    </TableCell>
                                    <TableCell align="right">{formatCurrencyVND(0)}</TableCell>
                                    <TableCell align="right">
                                        {formatCurrencyVND(item.unitPrice * item.quantity)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Box mb={6} className="flex justify-end">
                    <Box className="w-full">
                        <Box display="flex" justifyContent="space-between" py={1} borderBottom={1}>
                            <Typography fontWeight="medium">{t(i18n.translationKey.totalBeforeDiscount)}:</Typography>
                            <Typography>{formatCurrencyVND(total)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" py={1} borderBottom={1}>
                            <Typography fontWeight="medium">{t(i18n.translationKey.totalDiscount)}:</Typography>
                            <Typography>{formatCurrencyVND(0)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" py={1}>
                            <Typography fontWeight="medium">{t(i18n.translationKey.paymentMethod)}:</Typography>
                            <Typography>{formatPaidType(paidType)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" py={2}>
                            <Typography fontWeight="bold">{t(i18n.translationKey.totalPayment)}:</Typography>
                            <Typography fontWeight="bold">{formatCurrencyVND(total)}</Typography>
                        </Box>
                    </Box>
                </Box>
                {qrCode ? (
                    <Box
                        mt={4}
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <QRCode
                                removeQrCodeBehindLogo
                                value={qrCode}
                                size={250}
                                logoImage={AppLogo}
                                qrStyle="dots"
                                eyeRadius={5}
                            />
                        </Box>
                    </Box>
                ) : null}
            </Box>
        );
    },
);
