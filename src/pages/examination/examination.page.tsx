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
        [],
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
        [],
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
                                rowData={[]}
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
