import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";

interface UnpaidCostsProps {
    consultationFee?: number;
    examinationFee?: number;
    injectionFee?: number;
    vaccineFee?: number;
    testFee?: number;
    totalUnpaid?: number;
}

export const UnpaidCosts: React.FC<UnpaidCostsProps> = ({
    consultationFee = 0,
    examinationFee = 0,
    injectionFee = 0,
    vaccineFee = 0,
    testFee = 0,
    totalUnpaid = 0,
}) => {
    return (
        <Box sx={{ mt: 5, border: 1, borderColor: "grey.300", borderRadius: 2, p: 5 }}>
            <Typography variant="subtitle2" sx={{ ml: 2, fontSize: "1.125rem", fontWeight: "bold" }}>
                Chi phí chưa thanh toán
            </Typography>

            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid size={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>Giá công tư vấn:</Typography>
                        <Typography fontWeight="bold">{consultationFee.toLocaleString()} đ</Typography>
                    </Stack>
                </Grid>

                <Grid size={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>Giá công khám:</Typography>
                        <Typography fontWeight="bold">{examinationFee.toLocaleString()} đ</Typography>
                    </Stack>
                </Grid>

                <Grid size={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>Giá công tiêm:</Typography>
                        <Typography fontWeight="bold">{injectionFee.toLocaleString()} đ</Typography>
                    </Stack>
                </Grid>

                <Grid size={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>Giá vaccine:</Typography>
                        <Typography fontWeight="bold">{vaccineFee.toLocaleString()} đ</Typography>
                    </Stack>
                </Grid>

                <Grid size={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>Giá xét nghiệm:</Typography>
                        <Typography fontWeight="bold">{testFee.toLocaleString()} đ</Typography>
                    </Stack>
                </Grid>

                <Grid size={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6" fontWeight="bold">
                            Tạm tính tổng các chi phí chưa thanh toán:
                        </Typography>
                        <Typography variant="h6" color="error" fontWeight="bold">
                            {totalUnpaid.toLocaleString()} đ
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UnpaidCosts;
