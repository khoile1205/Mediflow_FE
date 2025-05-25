import { Box, Grid, InputAdornment, Stack, Typography } from "@mui/material";
import React from "react";
import FormItem from "~/components/form/form-item";

interface PreVaccinationProps {
    disabled?: boolean;
}
export const PreVaccination: React.FC<PreVaccinationProps> = ({ disabled }) => {
    return (
        <Stack className="pt-3" spacing={2} direction="column">
            <Box>
                <Typography variant="subtitle2" className="ms-2 text-lg">
                    Khám sàng lọc đối với trẻ trên 1 tháng tuổi
                </Typography>
                <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-2 border p-5">
                    <Grid container spacing={2.5}>
                        <Grid size={12 / 5}>
                            <FormItem
                                render="text-input"
                                label="Họ tên bố mẹ"
                                required
                                name="parentName"
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={12 / 5}>
                            <FormItem
                                render="text-input"
                                label="Số điện thoại"
                                required
                                name="parentPhoneNumber"
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={12 / 5}>
                            <FormItem
                                render="input-number"
                                label="Cân nặng"
                                required
                                name="kidWeight"
                                disabled={disabled}
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={12 / 5}>
                            <FormItem
                                render="input-number"
                                label="Thân nhiệt"
                                required
                                name="kidTemperature"
                                disabled={disabled}
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={12 / 5}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <FormItem
                                    render="input-number"
                                    label="Huyết áp"
                                    name="systolicBloodPressure"
                                    disabled={disabled}
                                />
                                <Typography>/</Typography>
                                <FormItem
                                    render="input-number"
                                    label="Huyết áp"
                                    name="diastolicBloodPressure"
                                    disabled={disabled}
                                />
                                <Typography>mmHg</Typography>
                            </Stack>
                        </Grid>
                        <Grid size={12}>
                            <Grid container spacing={2}>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="severeReactionPreviousVaccination"
                                        label="Sốt phản ứng nặng trong lần tiêm chủng trước"
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="acuteOrChronicDisease"
                                        label="Đang mắc bệnh cấp tính hoặc bệnh mạn tính tiến triển"
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="recentImmunosuppressiveTreatment"
                                        label="Đang hoặc mới kết thúc điều trị Corticoid/hoá trị/miễn dịch"
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="abnormalTemperatureOrVitals"
                                        label="Sốt/hạ thân nhiệt bất thường (≥ 39,5°C hoặc < 35°C) hoặc nhịp thở, nhịp tim, SpO2 bất thường"
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="abnormalHeartSound"
                                        label="Nghe tim bất thường"
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="heartValveAbnormality"
                                        label="Hẹp van tim hoặc bất thường van tim"
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="abnormalDisorder"
                                        label="Rối loạn bất thường (týp II hoặc kích thích)"
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="weightUnder2000g"
                                        label="Cân nặng dưới 2000g"
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="checkbox"
                                        name="otherContraindications"
                                        label="Có các chống chỉ định khác"
                                        disabled={disabled}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box>
                <Typography variant="subtitle2" className="ms-2 text-lg">
                    Kết luận
                </Typography>
                <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-2 border p-5">
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <FormItem
                                render="checkbox"
                                name="eligibleForVaccination"
                                label="Chỉ định tiêm chủng ngay (tất cả chỉ số/điểm đo đều bình thường)"
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormItem
                                render="checkbox"
                                name="contraindicatedForVaccination"
                                label="Chống chỉ định tiêm chủng (có điểm bất thường tại mục 1.8)"
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormItem
                                render="checkbox"
                                name="postponeVaccination"
                                label="Tạm hoãn tiêm chủng (có bất kỳ một chỉ số/điểm bất thường tại các mục 1, 2, 3, 4, 5, 6, 7)"
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormItem
                                render="checkbox"
                                name="referToHospital"
                                label="Đề nghị khám sàng lọc tại bệnh viện"
                                disabled={disabled}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Stack>
    );
};
