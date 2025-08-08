import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { TestResultStatus } from "~/constants/enums";
import { useMutationUpdatePostVaccinationResult } from "~/services/post-vaccination/hooks/mutations";
import {
    useQueryPostVaccinationMedicines,
    useQueryPostVaccinationPatients,
} from "~/services/post-vaccination/hooks/queries";
import { PostVaccinationMedicine, PostVaccinationPatient } from "~/services/post-vaccination/infras/types";
import { formatDate } from "~/utils/date-time";

const PostVaccinationPage: React.FC = () => {
    const { t } = useTranslation();
    const patientForm = useForm({
        defaultValues: {
            receptionId: null,
            vaccinationNumber: "",
            medicalCode: "",
            dob: "",
            gender: null,
            vaccinationNumberDuplicate: "",
            patientName: "",
        },
    });
    const followUpForm = useForm({
        defaultValues: {
            vaccinationId: null,
            vaccinationDate: null,
            confirmFollowUp: false,
            testResult: TestResultStatus.NEGATIVE,
            postVaccinationDate: null,
            reactionOccurred: false,
            reactionAfterInjectionTime: null,
            commonReactions: [],
            otherSymptoms: "",
        },
    });

    const patientAgGrid = useAgGrid({ rowSelection: "single" });
    const postVaccinationMedicineAgGrid = useAgGrid({});

    const [selectedReceptionId, setSelectedReceptionId] = React.useState<number | null>(null);
    const [searchName, setSearchName] = React.useState<string>("");

    const { patients: listPatients = [] } = useQueryPostVaccinationPatients(searchName);
    const { medicines: postVaccinationMedicines = [] } = useQueryPostVaccinationMedicines(selectedReceptionId);

    const { mutateAsync: updatePostVaccination } = useMutationUpdatePostVaccinationResult();

    const isPatientSelected = !!patientForm.watch("receptionId");

    const commonReactions = followUpForm.watch("commonReactions") || [];
    const isOtherSelected = commonReactions.includes("other");

    const handleRowClick = (e: RowClickedEvent<PostVaccinationPatient>) => {
        const selected = e.data;
        populatePatientForm(selected);
        setSelectedReceptionId(selected.receptionId);
    };

    const populatePatientForm = (selectedPatient: PostVaccinationPatient) => {
        patientForm.setValue("receptionId", selectedPatient.receptionId);
        patientForm.setValue("vaccinationNumber", selectedPatient.patientVaccinationCode);
        patientForm.setValue("medicalCode", selectedPatient.patientCode);
        patientForm.setValue("dob", selectedPatient.yearOfBirth);
        patientForm.setValue("gender", selectedPatient.gender);
        patientForm.setValue("patientName", selectedPatient.patientName);
    };

    const handleSelectMedicine = (selectedMedicine: RowClickedEvent<PostVaccinationMedicine>) => {
        const selectedRows = selectedMedicine.data;

        followUpForm.setValue("vaccinationId", selectedRows.vaccinationId);
        followUpForm.setValue("vaccinationDate", selectedRows.vaccinationDate);
    };

    const handleSave = async () => {
        const followUpData = followUpForm.getValues();

        await updatePostVaccination({
            receptionId: selectedReceptionId,
            data: {
                id: postVaccinationMedicines[0]?.vaccinationId,
                observationConfirmed: followUpData.confirmFollowUp,
                hasReaction: followUpData.reactionOccurred,
                reactionDate: followUpData.reactionAfterInjectionTime || null,
                postVaccinationResult: followUpData.testResult,
                postVaccinationDate: followUpData.postVaccinationDate || new Date(),
                hasFeverAbove39: followUpData.commonReactions?.includes("FEVER_ABOVE_39") ?? false,
                hasInjectionSiteReaction: followUpData.commonReactions?.includes("INJECTION_SITE_REACTION") ?? false,
                hasOtherReaction: !!followUpData.otherSymptoms,
                otherReactionDescription: followUpData.otherSymptoms || null,
            },
        });

        patientForm.reset();
        followUpForm.reset();
    };

    const handleCancelProcess = () => {
        patientForm.reset();
        followUpForm.reset();

        setSelectedReceptionId(null);

        patientAgGrid.gridApi.deselectAll();
        postVaccinationMedicineAgGrid.gridApi.deselectAll();
    };

    const patientColumnDefs: ColDef[] = [
        {
            headerName: t(i18n.translationKey.no),
            valueGetter: (p) => p.node?.rowIndex + 1,
            width: 60,
            pinned: "left",
            suppressSizeToFit: true,
            cellClass: "text-center",
        },
        { headerName: t(i18n.translationKey.patientName), field: "patientName", cellClass: "ag-cell-center" },
        { headerName: t(i18n.translationKey.dateOfBirth), field: "yearOfBirth", cellClass: "ag-cell-center" },
    ];

    const postVaccinationMedicinesColumnDefs: ColDef[] = React.useMemo(
        () => [
            {
                field: "no",
                headerName: t(i18n.translationKey.no),
                width: 60,
                cellClass: "ag-cell-center",
                suppressSizeToFit: true,
                headerStyle: { backgroundColor: "#98D2C0" },
                valueGetter: (p) => p.node?.rowIndex + 1,
            },
            {
                field: "medicineName",
                headerName: t(i18n.translationKey.vaccineSerumName),
                headerStyle: { backgroundColor: "#98D2C0" },
                flex: 1,
            },
            {
                field: "quantity",
                headerName: t(i18n.translationKey.quantity),
                headerStyle: { backgroundColor: "#98D2C0" },
                cellClass: "ag-cell-center",
            },
            {
                field: "vaccinationDate",
                headerName: t(i18n.translationKey.injectionDate),
                headerStyle: { backgroundColor: "#98D2C0" },
                valueFormatter: ({ value }) =>
                    value ? formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm:ss"]) : "",
            },
            {
                field: "observationConfirmed",
                headerName: t(i18n.translationKey.vaccinationConfirmation),
                headerStyle: { backgroundColor: "#98D2C0" },
                cellRenderer: "ag-cell-center",
                valueFormatter: ({ value }) =>
                    value
                        ? t(i18n.translationKey.observationConfirmed)
                        : t(i18n.translationKey.observationNotConfirmed),
            },
            {
                field: "reactionDate",
                headerName: t(i18n.translationKey.reactionDate),
                headerStyle: { backgroundColor: "#98D2C0" },
                cellRenderer: "ag-cell-center",
                valueFormatter: ({ value }) =>
                    value ? formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm:ss"]) : "",
            },
        ],
        [t],
    );

    const confirmFollowUp = followUpForm.watch("confirmFollowUp");
    const reactionOccurred = followUpForm.watch("reactionOccurred");

    const isFollowUpEnabled = React.useMemo(
        () => isPatientSelected && confirmFollowUp,
        [isPatientSelected, confirmFollowUp],
    );
    const isReactionEnabled = React.useMemo(
        () => isFollowUpEnabled && reactionOccurred,
        [isFollowUpEnabled, reactionOccurred],
    );

    return (
        <Box className="flex h-full">
            <DynamicForm form={patientForm}>
                <Box className="flex h-full basis-1/3 flex-col bg-[#F6F8D5] p-3">
                    <Stack spacing={2} className="flex-grow">
                        <FormItem
                            render="text-input"
                            name="vaccinationNumber"
                            label={t(i18n.translationKey.vaccinationNumber)}
                            slotProps={{ input: { readOnly: true } }}
                        />
                        <Grid container spacing={1}>
                            <Grid size={12}>
                                <SearchBox
                                    onChange={(value) => setSearchName(value)}
                                    label={t(i18n.translationKey.findPatient)}
                                />
                            </Grid>
                        </Grid>

                        <AgDataGrid
                            columnDefs={patientColumnDefs}
                            rowData={listPatients}
                            onRowClicked={handleRowClick}
                            {...patientAgGrid}
                        />

                        <FormItem
                            render="text-input"
                            name="medicalCode"
                            label={t(i18n.translationKey.medicalCode)}
                            slotProps={{ input: { readOnly: true } }}
                        />
                        <FormItem
                            render="text-input"
                            name="patientName"
                            label={t(i18n.translationKey.patientName)}
                            slotProps={{ input: { readOnly: true } }}
                        />
                        <Grid container spacing={1}>
                            <Grid size={6}>
                                <FormItem
                                    render="text-input"
                                    name="dob"
                                    label={t(i18n.translationKey.dateOfBirth)}
                                    slotProps={{ input: { readOnly: true } }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormItem
                                    render="text-input"
                                    name="gender"
                                    label={t(i18n.translationKey.gender)}
                                    slotProps={{ input: { readOnly: true } }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Box className="mt-4 flex gap-2">
                        <Button fullWidth variant="contained" color="primary" onClick={handleSave}>
                            {t(i18n.translationKey.save)}
                        </Button>
                        <Button fullWidth variant="contained" color="error" onClick={handleCancelProcess}>
                            {t(i18n.translationKey.cancel)}
                        </Button>
                    </Box>
                </Box>
            </DynamicForm>

            <Box
                className="flex h-full flex-1 flex-col p-3"
                sx={{
                    opacity: isPatientSelected ? 1 : 0.5,
                    pointerEvents: isPatientSelected ? "auto" : "none",
                }}
            >
                <DynamicForm form={followUpForm}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormItem
                                render="date-time-picker"
                                name="vaccinationDate"
                                defaultValue={null}
                                placeholder=""
                                label={t(i18n.translationKey.injectionCompleteTime)}
                                disabled={true}
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormItem
                                render="checkbox"
                                name="confirmFollowUp"
                                label={t(i18n.translationKey.confirmFollowUp)}
                                disabled={!isPatientSelected || followUpForm.watch("vaccinationId") === null}
                                checkboxProps={{
                                    onChange: () => {
                                        followUpForm.setValue("postVaccinationDate", new Date());
                                    },
                                }}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Box
                                sx={{
                                    position: "relative",
                                    border: "1px solid rgba(0, 0, 0, 0.23)",
                                    borderRadius: "4px",
                                    padding: "16px 8px 8px 8px",
                                }}
                            >
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        top: "-10px",
                                        left: "8px",
                                        backgroundColor: "#fff",
                                        px: "4px",
                                        fontSize: "0.75rem",
                                        color: isReactionEnabled ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.38)",
                                        fontWeight: 500,
                                    }}
                                >
                                    {t(i18n.translationKey.postVaccinationResult)}
                                </Typography>
                                <Box sx={{ pl: { xs: 2, sm: 5, md: 10, lg: 5, xl: 20 } }}>
                                    <FormItem
                                        render="radio-group"
                                        name="testResult"
                                        options={[
                                            {
                                                label: `1. ${t(i18n.translationKey.negative)}`,
                                                value: TestResultStatus.NEGATIVE,
                                            },
                                            {
                                                label: `2. ${t(i18n.translationKey.positive)}`,
                                                value: TestResultStatus.POSITIVE,
                                            },
                                        ]}
                                        disabled={!isFollowUpEnabled}
                                        radioGroupProps={{
                                            sx: { gap: { xs: 1, sm: 2, md: 3, lg: 5, xl: 8 } },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={12}>
                            <FormItem
                                render="checkbox"
                                name="reactionOccurred"
                                label={t(i18n.translationKey.reactionOccurred)}
                                disabled={
                                    !isFollowUpEnabled || followUpForm.watch("testResult") === TestResultStatus.NEGATIVE
                                }
                                checkboxProps={{
                                    onChange: () => {
                                        followUpForm.setValue("reactionAfterInjectionTime", new Date());
                                    },
                                }}
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormItem
                                render="date-time-picker"
                                name="reactionAfterInjectionTime"
                                label={t(i18n.translationKey.reactionAfterInjectionTime)}
                                disabled={true}
                                placeholder=""
                                defaultValue={null}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Box
                                sx={{
                                    position: "relative",
                                    border: "1px solid rgba(0, 0, 0, 0.23)",
                                    borderRadius: "4px",
                                    padding: "16px 8px 8px 8px",
                                }}
                            >
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        top: "-10px",
                                        left: "8px",
                                        backgroundColor: "#fff",
                                        px: "4px",
                                        fontSize: "0.75rem",
                                        color: isReactionEnabled ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.38)",
                                        fontWeight: 500,
                                    }}
                                >
                                    {t(i18n.translationKey.commonReactions)}
                                </Typography>
                                <Box
                                    sx={{
                                        pl: { md: 5, xl: 20 },
                                        "& .MuiFormGroup-root": {
                                            gap: { xs: 1, sm: 2, md: 3, lg: 5, xl: 8 },
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                        },
                                    }}
                                >
                                    <FormItem
                                        render="checkbox-group"
                                        name="commonReactions"
                                        options={[
                                            { label: t(i18n.translationKey.feverOver39), value: "fever" },
                                            { label: t(i18n.translationKey.painAtInjectionSite), value: "pain" },
                                            { label: t(i18n.translationKey.other), value: "other" },
                                        ]}
                                        disabled={!isReactionEnabled}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={12}>
                            <FormItem
                                render="text-area"
                                name="otherSymptoms"
                                label={t(i18n.translationKey.otherSymptoms)}
                                multiline
                                disabled={!isReactionEnabled || !isOtherSelected}
                            />
                        </Grid>
                    </Grid>

                    <Box className="mt-4">
                        <AgDataGrid
                            columnDefs={postVaccinationMedicinesColumnDefs}
                            rowData={postVaccinationMedicines}
                            onRowClicked={handleSelectMedicine}
                            {...postVaccinationMedicineAgGrid}
                        />
                    </Box>
                </DynamicForm>
            </Box>
        </Box>
    );
};

export default PostVaccinationPage;
