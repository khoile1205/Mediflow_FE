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
import { useMutationSavePostVaccination } from "~/services/post-vaccination/hooks/mutations/use-mutation-save-post-vaccination-result";
import { useMutationUpdatePostVaccinationResult } from "~/services/post-vaccination/hooks/mutations/use-mutation-update-post-vaccination-result";
import { useQueryPostVaccinationMedicines } from "~/services/post-vaccination/hooks/queries/useQueryPostVaccinationMedicines";
import { useQueryPostVaccinationPatients } from "~/services/post-vaccination/hooks/queries/useQueryPostVaccinationPatients";
import { showToast } from "~/utils";
import { PostVaccinationRequest } from "./types";

const PostVaccinationPage: React.FC = () => {
    const { t } = useTranslation();
    const patientForm = useForm();
    const followUpForm = useForm();

    const patientAgGrid = useAgGrid({ rowSelection: "single" });
    const reactionAgGrid = useAgGrid({});

    const [selectedReceptionId, setSelectedReceptionId] = React.useState<number | null>(null);
    const [searchName, setSearchName] = React.useState<string>("");

    const { patients: listPatients = [] } = useQueryPostVaccinationPatients(searchName);
    const { medicines: reactionData = [] } = useQueryPostVaccinationMedicines(selectedReceptionId ?? undefined);

    const { mutateAsync: savePostVaccination } = useMutationSavePostVaccination();
    const { mutateAsync: updatePostVaccination } = useMutationUpdatePostVaccinationResult();

    const isPatientSelected = !!patientForm.watch("receptionId");

    const commonReactions = followUpForm.watch("commonReactions") || [];
    const isOtherSelected = commonReactions.includes("other");

    const handleRowClick = (e: RowClickedEvent<any>) => {
        const selected = e.data;

        followUpForm.setValue("vaccinationId", selected.vaccinationId);
        patientForm.setValue("receptionId", selected.receptionId);
        patientForm.setValue("vaccinationNumber", selected.patientCode);
        patientForm.setValue("medicalCode", selected.patientCode);
        patientForm.setValue("dob", selected.yearOfBirth);
        patientForm.setValue("gender", selected.gender);
        patientForm.setValue("vaccinationNumberDuplicate", selected.patientCode);
        patientForm.setValue("patientName", selected.patientName);

        setSelectedReceptionId(selected.receptionId);
    };

    const handleSave = async () => {
        const patientData = patientForm.getValues();
        const followUpData = followUpForm.getValues();
        const isUpdate = !!patientData.vaccinationNumberDuplicate;

        try {
            if (isUpdate) {
                await updatePostVaccination({
                    vaccinationId: selectedReceptionId,
                    data: {
                        id: reactionData[0]?.vaccinationId,
                        observationConfirmed: followUpData.confirmFollowUp,
                        hasReaction: followUpData.reactionOccurred,
                        reactionDate: followUpData.reactionAfterInjectionTime || null,
                        postVaccinationResult: followUpData.testResult,
                        postVaccinationDate: followUpData.injectionCompleteTime || "",
                        hasFeverAbove39: followUpData.commonReactions?.includes("FEVER_ABOVE_39") ?? false,
                        hasInjectionSiteReaction:
                            followUpData.commonReactions?.includes("INJECTION_SITE_REACTION") ?? false,
                        hasOtherReaction: !!followUpData.otherSymptoms,
                        otherReactionDescription: followUpData.otherSymptoms || null,
                    },
                });
            } else {
                const createPayload: PostVaccinationRequest = {
                    vaccinationNumber: patientData.vaccinationNumber,
                    injectionCompleteTime: followUpData.injectionCompleteTime || "",
                    confirmFollowUp: followUpData.confirmFollowUp,
                    testResult: followUpData.testResult,
                    reactionOccurred: followUpData.reactionOccurred,
                    reactionAfterInjectionTime: followUpData.reactionAfterInjectionTime,
                    commonReactions: followUpData.commonReactions,
                    otherSymptoms: followUpData.otherSymptoms,
                };
                await savePostVaccination(createPayload);
            }

            showToast.success(t(i18n.translationKey.savedSuccessfully));
            patientForm.reset();
            followUpForm.reset();
        } catch (error) {
            showToast.error(t(i18n.translationKey.savedFailed));
        }
    };

    const patientColumnDefs: ColDef[] = [
        {
            headerName: t(i18n.translationKey.no),
            valueGetter: (p) => p.node?.rowIndex + 1,
            width: 60,
            pinned: "left",
            suppressSizeToFit: true,
        },
        { headerName: t(i18n.translationKey.patientName), field: "patientName" },
        { headerName: t(i18n.translationKey.dateOfBirth), field: "yearOfBirth" },
    ];

    const reactionColumnDefs: ColDef[] = React.useMemo(
        () => [
            {
                field: "no",
                headerName: t(i18n.translationKey.no),
                width: 60,
                pinned: "left",
                suppressSizeToFit: true,
                headerStyle: { backgroundColor: "#98D2C0" },
                valueGetter: (p) => p.node?.rowIndex + 1,
            },
            {
                field: "medicineName",
                headerName: t(i18n.translationKey.vaccineSerumName),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "quantity",
                headerName: t(i18n.translationKey.quantity),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "vaccinationDate",
                headerName: t(i18n.translationKey.injectionDate),
                headerStyle: { backgroundColor: "#98D2C0" },
                valueFormatter: ({ value }) => (value ? new Date(value).toLocaleString() : ""),
            },
            {
                field: "observationConfirmed",
                headerName: t(i18n.translationKey.vaccinationConfirmation),
                headerStyle: { backgroundColor: "#98D2C0" },
                cellRenderer: "agTextCellRenderer",
                valueFormatter: ({ value }) =>
                    value
                        ? t(i18n.translationKey.observationConfirmed)
                        : t(i18n.translationKey.observationNotConfirmed),
            },
            {
                field: "reactionDate",
                headerName: t(i18n.translationKey.reactionDate),
                headerStyle: { backgroundColor: "#98D2C0" },
                valueFormatter: ({ value }) => (value ? new Date(value).toLocaleString() : ""),
            },
        ],
        [t],
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
                            className="h-[210px]"
                        />

                        <FormItem
                            render="text-input"
                            name="medicalCode"
                            label={t(i18n.translationKey.medicalCode)}
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
                        <FormItem
                            render="text-input"
                            name="vaccinationNumberDuplicate"
                            label={t(i18n.translationKey.vaccinationNumber)}
                            slotProps={{ input: { readOnly: true } }}
                        />
                        <FormItem
                            render="text-input"
                            name="patientName"
                            label={t(i18n.translationKey.patientName)}
                            slotProps={{ input: { readOnly: true } }}
                        />
                    </Stack>

                    <Box className="mt-4 flex gap-2">
                        <Button fullWidth variant="contained" color="primary" onClick={handleSave}>
                            {t(i18n.translationKey.save)}
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: "#E23C3C", ":hover": { backgroundColor: "#d22c2c" } }}
                        >
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
                                name="injectionCompleteTime"
                                label={t(i18n.translationKey.injectionCompleteTime)}
                                disabled={!isPatientSelected}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormItem
                                render="checkbox"
                                name="confirmFollowUp"
                                label={t(i18n.translationKey.confirmFollowUp)}
                                disabled={!isPatientSelected}
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
                                        color: "rgba(0, 0, 0, 0.6)",
                                        fontWeight: 500,
                                    }}
                                >
                                    {t(i18n.translationKey.postVaccinationResult)}
                                </Typography>
                                <Box sx={{ pl: 20, "& .MuiFormGroup-root": { gap: 8, flexDirection: "row" } }}>
                                    <FormItem
                                        render="radio-group"
                                        name="testResult"
                                        options={[
                                            { label: `1. ${t(i18n.translationKey.negative)}`, value: "negative" },
                                            { label: `2. ${t(i18n.translationKey.positive)}`, value: "positive" },
                                        ]}
                                        disabled={!isPatientSelected}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={12}>
                            <FormItem
                                render="checkbox"
                                name="reactionOccurred"
                                label={t(i18n.translationKey.reactionOccurred)}
                                disabled={!isPatientSelected}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormItem
                                render="date-time-picker"
                                name="reactionAfterInjectionTime"
                                label={t(i18n.translationKey.reactionAfterInjectionTime)}
                                disabled={!isPatientSelected}
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
                                        color: "rgba(0, 0, 0, 0.6)",
                                        fontWeight: 500,
                                    }}
                                >
                                    {t(i18n.translationKey.commonReactions)}
                                </Typography>
                                <Box
                                    sx={{
                                        pl: 20,
                                        "& .MuiFormGroup-root": {
                                            gap: 8,
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
                                        disabled={!isPatientSelected}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={12}>
                            <FormItem
                                render="text-input"
                                name="otherSymptoms"
                                label={t(i18n.translationKey.otherSymptoms)}
                                multiline
                                rows={2}
                                disabled={!isPatientSelected || !isOtherSelected}
                            />
                        </Grid>
                    </Grid>

                    <Box className="mt-4">
                        <AgDataGrid
                            columnDefs={reactionColumnDefs}
                            rowData={reactionData}
                            {...reactionAgGrid}
                            className="h-[320px]"
                        />
                    </Box>
                </DynamicForm>
            </Box>
        </Box>
    );
};

export default PostVaccinationPage;
