import { AddCircleRounded, Cancel, EditSquare, KeyboardReturn, Save, Search } from "@mui/icons-material";
import { Box, Checkbox, FormControl, FormControlLabel, FormLabel, Grid } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import i18n from "~/configs/i18n";
import { useExaminationForm } from "./hooks";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { Examination, Patient, SampleQuality, SampleType } from "~/entities";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { formatDate } from "~/utils/date-time";
import { Gender } from "~/constants/enums";
import FormItem from "~/components/form/form-item";
import { useAuth } from "~/contexts/auth.context";
import { Role } from "~/constants/roles";

export const ExaminationPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const examinationAgGrid = useAgGrid({});
    const examinationResultAgGrid = useAgGrid({});

    const getGenderLabel = (gender: number | string) => {
        switch (gender) {
            case Gender.MALE:
            case "MALE":
                return t(i18n.translationKey.male);
            case Gender.FEMALE:
            case "FEMALE":
                return t(i18n.translationKey.female);
            default:
                return t(i18n.translationKey.other);
        }
    };

    const waitingExaminationList: Examination[] = [
        {
            id: 1,
            patient: {
                id: 101,
                code: "BN001",
                name: "Nguyễn Văn A",
                dob: new Date("1990-01-01"),
                gender: Gender.MALE,
                phoneNumber: "0901234567",
                email: "a@example.com",
                identityCard: "123456789",
                addressDetail: "123 Lê Lợi",
                province: "Hồ Chí Minh",
                district: "Quận 1",
                ward: "Bến Nghé",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: false,
                isForeigner: false,
            },
            diagnose: "Cảm cúm",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 1,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 1,
            receiverId: 1,
            conclusion: "Bình thường",
            note: "Không có vấn đề gì nghiêm trọng",
            isDiagnosed: true,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 2,
            patient: {
                id: 102,
                code: "BN002",
                name: "Trần Thị B",
                dob: new Date("1995-02-10"),
                gender: Gender.FEMALE,
                phoneNumber: "0902345678",
                email: "b@example.com",
                identityCard: "234567890",
                addressDetail: "456 Trần Hưng Đạo",
                province: "Hà Nội",
                district: "Hoàn Kiếm",
                ward: "Hàng Bạc",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: true,
                isForeigner: false,
            },
            diagnose: "Thiếu máu",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 2,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 2,
            receiverId: 2,
            conclusion: "Cần bổ sung sắt",
            note: "Hẹn tái khám sau 2 tuần",
            isDiagnosed: true,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 3,
            patient: {
                id: 103,
                code: "BN003",
                name: "Lê Văn C",
                dob: new Date("1988-06-20"),
                gender: Gender.MALE,
                phoneNumber: "0903456789",
                email: "c@example.com",
                identityCard: "345678901",
                addressDetail: "789 Nguyễn Trãi",
                province: "Đà Nẵng",
                district: "Hải Châu",
                ward: "Hòa Cường",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: false,
                isForeigner: true,
            },
            diagnose: "Nhiễm trùng đường tiểu",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 3,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 3,
            receiverId: 3,
            conclusion: "Đã cấp thuốc",
            note: "",
            isDiagnosed: true,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 4,
            patient: {
                id: 104,
                code: "BN004",
                name: "Phạm Thị D",
                dob: new Date("1999-12-15"),
                gender: Gender.FEMALE,
                phoneNumber: "0904567890",
                email: "d@example.com",
                identityCard: "456789012",
                addressDetail: "12 Phan Đình Phùng",
                province: "Huế",
                district: "Phú Nhuận",
                ward: "Vĩnh Ninh",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: false,
                isForeigner: false,
            },
            diagnose: "",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 4,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 4,
            receiverId: 4,
            conclusion: "",
            note: "",
            isDiagnosed: false,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 5,
            patient: {
                id: 105,
                code: "BN005",
                name: "Hoàng Văn E",
                dob: new Date("1975-03-18"),
                gender: Gender.MALE,
                phoneNumber: "0905678901",
                email: "e@example.com",
                identityCard: "567890123",
                addressDetail: "34 Trần Quốc Toản",
                province: "Hải Phòng",
                district: "Ngô Quyền",
                ward: "Lạch Tray",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: false,
                isForeigner: false,
            },
            diagnose: "Viêm họng",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 5,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 5,
            receiverId: 5,
            conclusion: "Kê thuốc điều trị",
            note: "Uống kháng sinh 5 ngày",
            isDiagnosed: true,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 6,
            patient: {
                id: 106,
                code: "BN006",
                name: "Trịnh Thị F",
                dob: new Date("1982-09-25"),
                gender: Gender.FEMALE,
                phoneNumber: "0906789012",
                email: "f@example.com",
                identityCard: "678901234",
                addressDetail: "56 Võ Văn Tần",
                province: "Cần Thơ",
                district: "Ninh Kiều",
                ward: "Tân An",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: true,
                isForeigner: true,
            },
            diagnose: "",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 6,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 6,
            receiverId: 6,
            conclusion: "",
            note: "",
            isDiagnosed: false,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 7,
            patient: {
                id: 107,
                code: "BN007",
                name: "Lâm Văn G",
                dob: new Date("1989-07-30"),
                gender: Gender.MALE,
                phoneNumber: "0907890123",
                email: "g@example.com",
                identityCard: "789012345",
                addressDetail: "78 Phạm Ngũ Lão",
                province: "Nghệ An",
                district: "Vinh",
                ward: "Hồng Sơn",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: false,
                isForeigner: false,
            },
            diagnose: "Xét nghiệm máu",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 7,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 7,
            receiverId: 7,
            conclusion: "Bình thường",
            note: "",
            isDiagnosed: true,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 8,
            patient: {
                id: 108,
                code: "BN008",
                name: "Ngô Thị H",
                dob: new Date("1991-01-19"),
                gender: Gender.FEMALE,
                phoneNumber: "0908901234",
                email: "h@example.com",
                identityCard: "890123456",
                addressDetail: "90 Nguyễn Văn Cừ",
                province: "Lâm Đồng",
                district: "Bảo Lộc",
                ward: "Lộc Sơn",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: true,
                isForeigner: false,
            },
            diagnose: "",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 8,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 8,
            receiverId: 8,
            conclusion: "",
            note: "",
            isDiagnosed: false,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 9,
            patient: {
                id: 109,
                code: "BN009",
                name: "Đặng Văn I",
                dob: new Date("1980-05-05"),
                gender: Gender.MALE,
                phoneNumber: "0909012345",
                email: "i@example.com",
                identityCard: "901234567",
                addressDetail: "23 Lê Văn Sỹ",
                province: "Bình Dương",
                district: "Dĩ An",
                ward: "Tân Bình",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: false,
                isForeigner: true,
            },
            diagnose: "Đau dạ dày",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 9,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 9,
            receiverId: 9,
            conclusion: "Bắt đầu điều trị",
            note: "",
            isDiagnosed: true,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
        {
            id: 10,
            patient: {
                id: 110,
                code: "BN010",
                name: "Bùi Thị J",
                dob: new Date("1996-11-11"),
                gender: Gender.FEMALE,
                phoneNumber: "0910123456",
                email: "j@example.com",
                identityCard: "012345678",
                addressDetail: "11 Lê Duẩn",
                province: "Tiền Giang",
                district: "Mỹ Tho",
                ward: "Phường 1",
                createdBy: 1,
                lastUpdatedBy: 1,
                isPregnant: false,
                isForeigner: false,
            },
            diagnose: "",
            receiptTime: new Date(),
            executeTime: new Date(),
            performTechnicianId: 10,
            appointmentTimeForResult: new Date(),
            resultForm: null,
            sampleType: null,
            sampleQuality: null,
            concludedDoctorId: 10,
            receiverId: 10,
            conclusion: "",
            note: "",
            isDiagnosed: false,
            createdBy: 1,
            lastUpdatedBy: 1,
        },
    ];

    const examinationColumnDefs = React.useMemo(
        () =>
            [
                { field: "patient.code", headerName: t(i18n.translationKey.medicalCode) },
                { field: "patient.name", headerName: t(i18n.translationKey.patientName) },
                {
                    field: "patient.dob",
                    headerName: t(i18n.translationKey.yearOfBirth),
                    valueFormatter: ({ value }) => formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy"]).split("/")[2],
                    cellClass: "ag-cell-center",
                },
                {
                    headerName: t(i18n.translationKey.call),
                    cellClass: "ag-cell-center",
                    cellRenderer: (params: ICellRendererParams<Examination>) => (
                        <>
                            <ActionButton
                                label={t(i18n.translationKey.call)}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 4, px: 2, py: 0, height: "70%" }}
                                onClick={() => handleSelectExamination(params.data)}
                            />
                        </>
                    ),
                },
            ] as ColDef<Examination>[],
        [waitingExaminationList],
    );

    const examinationResultList: Examination[] = [];

    const examinationResultColumnDefs = React.useMemo(
        () =>
            [
                {
                    checkboxSelection: true,
                    headerCheckboxSelection: true,
                    width: 50,
                    pinned: true,
                    resizable: false,
                },
                { headerName: t(i18n.translationKey.requestNumber) },
                { headerName: t(i18n.translationKey.serviceName) },
                {
                    headerName: t(i18n.translationKey.result),
                    headerStyle: {
                        textAlign: "center",
                        fontWeight: "bold",
                        backgroundColor: "#4f959d",
                    },
                    cellStyle: {
                        backgroundColor: "#4f959d",
                    },
                },
                {
                    headerName: t(i18n.translationKey.standardValue),
                },
                {
                    headerName: t(i18n.translationKey.specimenDeviceType),
                },
            ] as ColDef<Examination>[],
        [examinationResultList],
    );

    const form = useExaminationForm();

    const handlePatientSearch = () => {
        //setSearchWaitingPatientTerm(value);
    };

    const handleSelectExamination = (selectedExamination: Examination) => {
        const selectedPatient: Patient = selectedExamination.patient;
        form.setValue("patient.code", selectedPatient.code);
        form.setValue("patient.name", selectedPatient.name);
        form.setValue("patient.dob", selectedPatient.dob);
        form.setValue("patient.gender", selectedPatient.gender);

        const patientYearOld = new Date().getFullYear() - selectedPatient.dob.getFullYear();
        form.setValue("patientYearOld", patientYearOld);
        form.setValue("patientYOB", selectedPatient.dob.getFullYear());

        if (user.roles.includes(Role.LaboratoryStaff)) {
            form.setValue("performTechnicianId", user.id);
            form.setValue("performTechnicianName", user.name);
        }

        if (user.roles.includes(Role.Doctor)) {
            form.setValue("concludedDoctorId", user.id);
            form.setValue("concludedDoctorName", user.name);
        }
    };

    return (
        <>
            <Grid container spacing={2} marginBottom={1}>
                <ActionButton
                    label={t(i18n.translationKey.addNew)}
                    startIcon={<AddCircleRounded />}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 4,
                        px: 2,
                        flexGrow: 1,
                    }}
                />
                <ActionButton
                    label={t(i18n.translationKey.edit)}
                    startIcon={<EditSquare />}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 4,
                        px: 2,
                        flexGrow: 1,
                    }}
                />
                <ActionButton
                    label={t(i18n.translationKey.save)}
                    startIcon={<Save />}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 4,
                        px: 2,
                        flexGrow: 1,
                    }}
                />
                <ActionButton
                    label={t(i18n.translationKey.cancel)}
                    startIcon={<KeyboardReturn />}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 4,
                        px: 2,
                        flexGrow: 1,
                    }}
                />
                <ActionButton
                    label={t(i18n.translationKey.delete)}
                    startIcon={<Cancel />}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 4,
                        px: 2,
                        flexGrow: 1,
                    }}
                />
                <ActionButton
                    label={t(i18n.translationKey.search)}
                    startIcon={<Search />}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 4,
                        px: 2,
                        flexGrow: 1,
                    }}
                />
            </Grid>
            <DynamicForm form={form}>
                <Grid container>
                    <Grid
                        size={4}
                        bgcolor={"warning.light"}
                        borderRadius={4}
                        padding={1}
                        sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    >
                        <Box marginBottom={2} border={2} borderColor={"primary.main"} borderRadius={4} padding={1}>
                            <SearchBox
                                onChange={handlePatientSearch}
                                placeholder={t(i18n.translationKey.untestedPatient)}
                            />
                            <Grid textAlign={"right"}>
                                <FormControlLabel
                                    sx={{ margin: 0 }}
                                    control={<Checkbox />}
                                    label={t(i18n.translationKey.isDiagnosed)}
                                />
                            </Grid>
                            <AgDataGrid
                                columnDefs={examinationColumnDefs}
                                rowData={waitingExaminationList}
                                maxRows={5}
                                cellSelection={false}
                                {...examinationAgGrid}
                            />
                        </Box>
                        <Grid spacing={2}>
                            <Grid container spacing={2}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <FormItem
                                        render="text-input"
                                        name="patient.code"
                                        label={t(i18n.translationKey.medicalCode)}
                                        slotProps={{ input: { readOnly: true } }}
                                    />
                                </Box>
                                <Box>
                                    <FormItem
                                        render="text-input"
                                        name="patientYearOld"
                                        label={t(i18n.translationKey.yearOld)}
                                        slotProps={{ input: { readOnly: true } }}
                                    />
                                </Box>
                            </Grid>
                            <FormItem
                                render="text-input"
                                name="patient.name"
                                label={t(i18n.translationKey.fullName)}
                                slotProps={{ input: { readOnly: true } }}
                            />
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="patient.gender"
                                        label={t(i18n.translationKey.gender)}
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                                value: getGenderLabel(form.watch("patient.gender")),
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormItem
                                        render="text-input"
                                        name="patientYOB"
                                        label={t(i18n.translationKey.yearOfBirth)}
                                        slotProps={{ input: { readOnly: true } }}
                                    />
                                </Grid>
                            </Grid>
                            <FormItem
                                render="text-area"
                                name="diagnose"
                                label={t(i18n.translationKey.diagnose)}
                                rows={2}
                                required
                            />
                            <FormItem
                                render="text-input"
                                name="receiptTime"
                                label={t(i18n.translationKey.receiptTime)}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        value: formatDate(
                                            form.watch("receiptTime"),
                                            DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"],
                                        ),
                                    },
                                }}
                            />
                            <FormItem
                                render="text-input"
                                name="performTechnicianName"
                                label={t(i18n.translationKey.performTechnician)}
                                slotProps={{
                                    input: { readOnly: true },
                                }}
                            />
                            <FormControl required fullWidth className="mb-2">
                                <FormLabel>{t(i18n.translationKey.returnResultsAfter)}</FormLabel>
                                <Grid spacing={2} textAlign={"right"}>
                                    <FormItem
                                        render="radio-group"
                                        name="returnResultsAfter"
                                        label={t(i18n.translationKey.returnResultsAfter)}
                                        options={[
                                            { label: t(i18n.translationKey.thirtyMinutes), value: "30" },
                                            { label: t(i18n.translationKey.sixtyMinutes), value: "60" },
                                            { label: t(i18n.translationKey.ninetyMinutes), value: "90" },
                                        ]}
                                    />
                                </Grid>
                            </FormControl>
                            <FormItem
                                render="select"
                                name="sampleType"
                                label={t(i18n.translationKey.sampleType)}
                                required
                                options={[
                                    { label: t(i18n.translationKey.blood), value: SampleType.BLOOD },
                                    { label: t(i18n.translationKey.fluid), value: SampleType.FLUID },
                                    { label: t(i18n.translationKey.urine), value: SampleType.URINE },
                                    { label: t(i18n.translationKey.semen), value: SampleType.SEMEN },
                                    { label: t(i18n.translationKey.fluidUrine), value: SampleType.FLUID_URINE },
                                    { label: t(i18n.translationKey.fluidBlood), value: SampleType.FLUID_BLOOD },
                                    { label: t(i18n.translationKey.bloodUrine), value: SampleType.BLOOD_URINE },
                                    {
                                        label: t(i18n.translationKey.fluidUrineBlood),
                                        value: SampleType.FLUID_URINE_BLOOD,
                                    },
                                ]}
                                className="mb-2"
                            />
                            <FormItem
                                render="select"
                                name="sampleQuality"
                                label={t(i18n.translationKey.sampleQuality)}
                                required
                                options={[
                                    { label: t(i18n.translationKey.high), value: SampleQuality.HIGH },
                                    { label: t(i18n.translationKey.medium), value: SampleQuality.MEDIUM },
                                    { label: t(i18n.translationKey.low), value: SampleQuality.LOW },
                                ]}
                                className="mb-2"
                            />
                            <FormItem
                                render="text-input"
                                name="concludedDoctorName"
                                label={t(i18n.translationKey.concludedDoctor)}
                                slotProps={{
                                    input: { readOnly: true },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction={"column"} size={8}>
                        <Grid
                            border={1}
                            borderColor={"primary.main"}
                            borderRadius={4}
                            padding={1}
                            sx={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                flexGrow: 1,
                            }}
                        >
                            <AgDataGrid
                                columnDefs={examinationResultColumnDefs}
                                rowData={examinationResultList}
                                maxRows={5}
                                cellSelection={false}
                                {...examinationResultAgGrid}
                            />
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            bgcolor={"warning.light"}
                            borderRadius={4}
                            sx={{
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                            className="p-2 pt-4"
                        >
                            <Grid size={6}>
                                <FormItem
                                    render="text-area"
                                    name="conclusion"
                                    label={t(i18n.translationKey.conclusion)}
                                    rows={2}
                                    required
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormItem
                                    render="text-area"
                                    name="note"
                                    label={t(i18n.translationKey.note)}
                                    rows={2}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DynamicForm>
        </>
    );
};
