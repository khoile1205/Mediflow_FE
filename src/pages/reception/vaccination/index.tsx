import { AddCircle, Clear, Edit, Save, Search, Undo } from "@mui/icons-material";
import { Box, Grid, Stack } from "@mui/material";
import React from "react";
import { ActionButton } from "~/components/common/action-button";
import DistrictFormItem from "~/components/form/custom/district.form-item";
import ProvinceFormItem from "~/components/form/custom/province.form-item";
import WardFormItem from "~/components/form/custom/ward.form-item";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import { PHONE_NUMBER_PATTERN } from "~/components/form/validation/pattern";
import { PreVaccination } from "./pre-vaccination";
import { TestIndication } from "./test_indication";
import { UnpaidCosts } from "./unpaid_costs";
import { VaccinationIndication } from "./vaccination_indication";

type TabType = "pre_vaccination" | "vaccination_indication" | "test_indication" | "unpaid_costs";

const ReceptionVaccination: React.FC = () => {
    const [tab, setTab] = React.useState<TabType>("pre_vaccination");
    const [isNewPatient, setIsNewPatient] = React.useState<boolean>(false);

    const form = useForm();

    const handleCancel = () => {
        form.reset();
        setIsNewPatient(false);
    };

    const handleReset = () => {
        form.reset();
    };

    const onSavePatient = () => {
        console.log("Patient saved:", form.getValues());
    };

    const isDisabledInput = React.useMemo(() => {
        return !isNewPatient;
    }, [isNewPatient]);

    return (
        <DynamicForm form={form}>
            <Stack spacing={1} direction="row" width="100%" className="px-4 py-5">
                <ActionButton
                    label="Thêm mới"
                    startIcon={<AddCircle />}
                    onClick={() => {
                        setIsNewPatient(true);
                    }}
                />
                <ActionButton label="Tìm kiếm" startIcon={<Search />} />
                <ActionButton label="Sửa" startIcon={<Edit />} disabled={!isNewPatient} />
                <ActionButton
                    label="Lưu"
                    startIcon={<Save />}
                    disabled={!isNewPatient}
                    onClick={form.handleSubmit(onSavePatient)}
                />
                <ActionButton label="Xóa" startIcon={<Clear />} disabled={!isNewPatient} onClick={handleReset} />
                <ActionButton label="Hủy" startIcon={<Undo />} disabled={!isNewPatient} onClick={handleCancel} />
                {/* <ActionButton label="Nhập kết quả thử" disabled={!isNewPatient} /> */}
                <ActionButton label="Xóa chỉ định thanh toán" disabled={!isNewPatient} />
            </Stack>

            <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-2 border px-2 pt-4">
                <Grid container spacing={1}>
                    <Grid size={12}>
                        <Grid container spacing={1}>
                            <Grid size={3}>
                                <FormItem
                                    name="patientId"
                                    render="text-input"
                                    placeholder="Mã y tế"
                                    label="Mã y tế"
                                    required
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    name="fullName"
                                    render="text-input"
                                    placeholder="Họ và tên"
                                    label="Họ và tên"
                                    required
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    name="gender"
                                    render="select"
                                    placeholder="Giới tính"
                                    label="Giới tính"
                                    size="small"
                                    required
                                    options={[
                                        { label: "Nam", value: "male" },
                                        { label: "Nữ", value: "female" },
                                    ]}
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    name="dateOfBirth"
                                    render="date-picker"
                                    placeholder="Ngày sinh"
                                    required
                                    label="Ngày sinh"
                                    defaultValue={new Date()}
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={1}>
                            <Grid size={9}>
                                <FormItem
                                    name="address"
                                    render="text-input"
                                    placeholder="Địa chỉ cụ thể"
                                    label="Địa chỉ cụ thể"
                                    required
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <Box className="flex items-center justify-center">
                                    <FormItem
                                        name="isForeigned"
                                        render="switch"
                                        label="Bệnh nhân nước ngoài"
                                        defaultValue={true}
                                        disabled={isDisabledInput}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={1}>
                            <Grid size={3}>
                                <ProvinceFormItem size="small" disabled={isDisabledInput} />
                            </Grid>
                            <Grid size={3}>
                                <DistrictFormItem size="small" disabled={isDisabledInput} />
                            </Grid>
                            <Grid size={3}>
                                <WardFormItem size="small" disabled={isDisabledInput} />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    name="phoneNumber"
                                    render="text-input"
                                    placeholder="Số điện thoại"
                                    label="Số điện thoại"
                                    required
                                    pattern={PHONE_NUMBER_PATTERN}
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={1}>
                            <Grid size={3}>
                                <FormItem
                                    render="date-time-picker"
                                    name="receptionTime"
                                    label="Thời gian tiếp nhận"
                                    required
                                    defaultValue={new Date()}
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    render="select"
                                    label="Loại bệnh nhân"
                                    name="service"
                                    size="small"
                                    options={[{ label: "Test", value: "Test" }]}
                                    required
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormItem
                                    render="switch"
                                    name="isPregnant"
                                    label="Có thai"
                                    disabled={isDisabledInput}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ borderColor: "primary.main", borderRadius: 2 }} className="mt-5 border p-2">
                <Stack spacing={5} direction="row" width="100%">
                    <ActionButton
                        label="Khám sàng lọc"
                        startIcon={<AddCircle />}
                        onClick={() => setTab("pre_vaccination")}
                    />
                    <ActionButton
                        label="Chỉ định tiêm chủng"
                        startIcon={<Edit />}
                        onClick={() => setTab("vaccination_indication")}
                    />
                    <ActionButton
                        label="Chỉ định xét nghiệm"
                        startIcon={<Save />}
                        onClick={() => setTab("test_indication")}
                    />
                    <ActionButton
                        label="Chi phí chưa thanh toán"
                        startIcon={<Clear />}
                        onClick={() => setTab("unpaid_costs")}
                    />
                </Stack>
            </Box>

            {tab === "pre_vaccination" && <PreVaccination disabled={isDisabledInput} />}
            {tab === "vaccination_indication" && <VaccinationIndication />}
            {tab === "test_indication" && <TestIndication />}
            {tab === "unpaid_costs" && <UnpaidCosts />}
        </DynamicForm>
    );
};

export default ReceptionVaccination;
