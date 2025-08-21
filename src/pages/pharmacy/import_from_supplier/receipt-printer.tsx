import {
    Box,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React from "react";
import { ImportMedicineFromSupplierFormValues } from "./types";
import { formatCurrencyVND, numberToVietnamese } from "~/utils/currency";

interface ImportMedicineFromSupplierReceiptPrinterProps {
    receiptInformation: ImportMedicineFromSupplierFormValues;
}

const ReceiptPrinter = React.forwardRef<HTMLDivElement, ImportMedicineFromSupplierReceiptPrinterProps>(
    ({ receiptInformation }, ref) => {
        const date = new Date();

        const importPharmacyTotalPrice =
            receiptInformation?.details?.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0) || 0;

        return (
            <Box ref={ref} p={4}>
                {/* Header */}
                <Grid container justifyContent="space-between">
                    <Grid>
                        <Typography variant="body1" fontWeight={"bold"}>
                            Đơn vị: CDC Đà Nẵng
                        </Typography>
                        <Typography variant="body1" fontWeight={"bold"}>
                            Bộ phận: Kho dược
                        </Typography>
                    </Grid>
                    <Grid textAlign="right">
                        <Typography variant="body1" fontWeight="bold">
                            Mẫu số 01 - VT
                        </Typography>
                        <Typography variant="caption">
                            (Ban hành theo Thông tư số 200/2014/TT-BTC
                            <br />
                            Ngày 22/12/2014 của Bộ Tài chính)
                        </Typography>
                    </Grid>
                </Grid>

                {/* Title */}
                <Box textAlign="center" mt={2}>
                    <Typography variant="h6" fontWeight="bold">
                        PHIẾU NHẬP KHO
                    </Typography>
                    <Box>
                        <i>
                            Ngày {date.getDate()} tháng {date.getMonth() + 1} năm {date.getFullYear()}
                        </i>
                    </Box>
                    <Typography variant="body1">Số: {receiptInformation?.documentNumber}</Typography>
                </Box>

                {/* Information */}
                <Box mt={3}>
                    <Typography variant="body1">
                        - Họ và tên người giao: ................................................
                    </Typography>
                    <Typography variant="body1">
                        - Theo {receiptInformation?.supportingDocument} ngày ....... tháng ....... năm ....... của{" "}
                        {receiptInformation?.supplierName}
                    </Typography>
                    <Typography variant="body1">Nhập tại: Kho dược, địa điểm: CDC Đà Nẵng</Typography>
                </Box>

                {/* Table */}
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small" border={1}>
                        <TableHead>
                            <TableRow>
                                <TableCell rowSpan={2} align="center">
                                    STT
                                </TableCell>
                                <TableCell rowSpan={2} align="center">
                                    Tên, nhãn hiệu, quy cách, phẩm chất vật tư, dụng cụ sản phẩm, hàng hóa
                                </TableCell>
                                <TableCell rowSpan={2} align="center">
                                    Mã số
                                </TableCell>
                                <TableCell colSpan={2} align="center">
                                    Số lượng
                                </TableCell>
                                <TableCell rowSpan={2} align="center">
                                    Đơn giá
                                </TableCell>
                                <TableCell rowSpan={2} align="center">
                                    Thành tiền
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">Theo chứng từ</TableCell>
                                <TableCell align="center">Thực nhập</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {receiptInformation?.details?.map((medicine, index) => (
                                <TableRow key={medicine.medicineId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{medicine.medicineName}</TableCell>
                                    <TableCell>{medicine.medicineCode}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center">{medicine.quantity}</TableCell>
                                    <TableCell align="center">
                                        {formatCurrencyVND(Number(medicine.unitPrice))}
                                    </TableCell>
                                    <TableCell align="center">
                                        {formatCurrencyVND(medicine.quantity * medicine.unitPrice)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                                    Cộng
                                </TableCell>
                                <TableCell align="center">x</TableCell>
                                <TableCell align="center">x</TableCell>
                                <TableCell align="center">x</TableCell>
                                <TableCell align="center">x</TableCell>
                                <TableCell>{formatCurrencyVND(importPharmacyTotalPrice)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Footer */}
                <Box mt={2}>
                    <Typography variant="body1">
                        - Tổng số tiền (viết bằng chữ): {numberToVietnamese(importPharmacyTotalPrice)} đồng
                    </Typography>
                    <Typography variant="body1">
                        - Số chứng từ gốc kèm theo: {receiptInformation?.documentCode}
                    </Typography>
                </Box>
                <Box textAlign="end">
                    <i>
                        Ngày {date.getDate()} tháng {date.getMonth() + 1} năm {date.getFullYear()}
                    </i>
                </Box>
                {/* Signature Section */}
                <Grid container justifyContent="space-between">
                    <Grid textAlign="center">
                        <Typography fontWeight={600}>Người lập phiếu</Typography>
                        <i>(Ký, họ tên)</i>
                    </Grid>
                    <Grid textAlign="center">
                        <Typography fontWeight={600}>Người giao hàng</Typography>
                        <i>(Ký, họ tên)</i>
                    </Grid>
                    <Grid textAlign="center">
                        <Typography fontWeight={600}>Thủ kho</Typography>
                        <i>(Ký, họ tên)</i>
                    </Grid>
                    <Grid textAlign="center">
                        <Typography fontWeight={600}>Kế toán trưởng</Typography>
                        <Typography>(Hoặc bộ phận có nhu cầu nhập)</Typography>
                        <i>(Ký, họ tên)</i>
                    </Grid>
                </Grid>
            </Box>
        );
    },
);

export default ReceiptPrinter;
