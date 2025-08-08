import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { PaymentType } from "~/constants/enums";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";
import { HospitalFeeFormValue } from "./types";

interface ReceiptPrinterProps {
    formValue: HospitalFeeFormValue;
}

export const ReceiptPrinter = React.forwardRef<HTMLDivElement, ReceiptPrinterProps>(({ formValue }, ref) => {
    const { name, patientCode, dob, age, address, invoiceNumber, paidType, hospitalServiceItems = [] } = formValue;

    const formatPaidType = (type?: PaymentType) => {
        switch (type) {
            case PaymentType.CASH:
                return "Tiền mặt";
            case PaymentType.ATM:
                return "ATM";
            case PaymentType.TRANSFER:
                return "Chuyển khoản";
            default:
                return "Không xác định";
        }
    };

    const total = hospitalServiceItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    return (
        <Box ref={ref} sx={{ padding: 2, height: "100%" }}>
            <Box className="border-b-2 border-gray-300 px-4">
                <Box className="mb-2 flex items-start justify-between">
                    <Box className="flex items-center">
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                Mediflow
                            </Typography>
                            <Typography variant="body2">123 Đường Y Tế, Quận Hải Châu, Đà Nẵng</Typography>
                            <Typography variant="body2">Điện thoại: (0236) 123 4567</Typography>
                        </Box>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="body2">
                            Số: <strong>{invoiceNumber || "N/A"}</strong>
                        </Typography>
                        <Typography variant="body2">
                            Ngày: {formatDate(new Date(), DATE_TIME_FORMAT["dd/MM/yyyy"])}
                        </Typography>
                        <Typography variant="body2">
                            Giờ: {formatDate(new Date(), DATE_TIME_FORMAT["HH:mm:ss"])}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold" align="center" mt={4}>
                    PHIẾU THU THANH TOÁN
                </Typography>
            </Box>

            <Box mb={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    THÔNG TIN BỆNH NHÂN
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Typography>
                            <strong>Họ và tên:</strong> {name}
                        </Typography>
                        <Typography>
                            <strong>Mã y tế:</strong> {patientCode}
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography>
                            <strong>Ngày sinh:</strong> {dob}
                        </Typography>
                        <Typography>
                            <strong>Tuổi:</strong> {age}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography>
                    <strong>Địa chỉ:</strong> {address}
                </Typography>
            </Box>

            <Box mb={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    CHI TIẾT THANH TOÁN
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                            <TableCell>Nội dung</TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="right">Đơn giá</TableCell>
                            <TableCell align="right">Thành tiền trước chiết khấu</TableCell>
                            <TableCell align="right">Số tiền trợ</TableCell>
                            <TableCell align="right">Thành tiền sau chiết khấu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hospitalServiceItems.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{item.serviceName}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="right">{formatCurrencyVND(item.unitPrice)}</TableCell>
                                <TableCell align="right">{formatCurrencyVND(item.unitPrice * item.quantity)}</TableCell>
                                <TableCell align="right">{formatCurrencyVND(0)}</TableCell>
                                <TableCell align="right">{formatCurrencyVND(item.unitPrice * item.quantity)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            <Box mb={6} className="flex justify-end">
                <Box className="w-full">
                    <Box display="flex" justifyContent="space-between" py={1} borderBottom={1}>
                        <Typography fontWeight="medium">Tổng tiền trước chiết khấu:</Typography>
                        <Typography>{formatCurrencyVND(total)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" py={1} borderBottom={1}>
                        <Typography fontWeight="medium">Tổng số tiền trợ:</Typography>
                        <Typography>{formatCurrencyVND(0)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" py={1}>
                        <Typography fontWeight="medium">Hình thức thanh toán:</Typography>
                        <Typography>{formatPaidType(paidType)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" py={2}>
                        <Typography fontWeight="bold">Tổng tiền thanh toán:</Typography>
                        <Typography fontWeight="bold">{formatCurrencyVND(total)}</Typography>
                    </Box>
                </Box>
            </Box>

            {/* <Box>
                <Divider sx={{ mb: 2 }} />
                <Typography align="center" fontStyle="italic" gutterBottom>
                    Lưu ý: Phiếu thu chỉ có giá trị trong ngày
                </Typography>
                <Box className="mt-8 flex justify-between">
                    <Box textAlign="center" width="33%">
                        <Typography fontWeight="medium">Người thu tiền</Typography>
                        <Typography fontSize="0.75rem" fontStyle="italic">
                            (Ký, ghi rõ họ tên)
                        </Typography>
                        <Box height="64px" />
                    </Box>
                    <Box textAlign="center" width="33%">
                        <Typography fontWeight="medium">Người nộp tiền</Typography>
                        <Typography fontSize="0.75rem" fontStyle="italic">
                            (Ký, ghi rõ họ tên)
                        </Typography>
                        <Box height="64px" />
                    </Box>
                </Box>
            </Box> */}
        </Box>
    );
});
