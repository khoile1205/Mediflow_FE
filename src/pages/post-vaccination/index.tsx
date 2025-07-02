import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";

const PostVaccinationPage: React.FC = () => {
    const { t } = useTranslation();
    const patientForm = useForm();
    const followUpForm = useForm();

    const patientAgGrid = useAgGrid({});
    const reactionAgGrid = useAgGrid({});

    const patientColumnDefs: ColDef[] = [
        { headerName: t(i18n.translationKey.no), field: "no", width: 30 },
        { headerName: t(i18n.translationKey.patientName), field: "patientName" },
        { headerName: t(i18n.translationKey.dateOfBirth), field: "dob" },
    ];

    const reactionColumnDefs: ColDef<any>[] = React.useMemo(
        () => [
            {
                field: "no",
                headerName: t(i18n.translationKey.no),
                width: 30,
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "vaccineName",
                headerName: t(i18n.translationKey.vaccineSerumName),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "batchCode",
                headerName: t(i18n.translationKey.batchNumber),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "quantity",
                headerName: t(i18n.translationKey.quantity),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "injectionDate",
                headerName: t(i18n.translationKey.injectionDate),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "followUpStatus",
                headerName: t(i18n.translationKey.vaccinationConfirmation),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "reactionDate",
                headerName: t(i18n.translationKey.reactionDate),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "doctor",
                headerName: t(i18n.translationKey.instructedDoctor),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
        ],
        [t],
    );

    const handleSearch = (value: string) => {
        console.log("Search:", value);
    };

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

                        <Grid container spacing={1} alignItems="center">
                            <Grid size={12}>
                                <SearchBox onChange={handleSearch} label={t(i18n.translationKey.findPatient)} />
                            </Grid>
                        </Grid>

                        <AgDataGrid
                            columnDefs={patientColumnDefs}
                            rowData={[]}
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
                        <Button fullWidth variant="contained" color="primary">
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

            <Box className="flex h-full flex-1 flex-col p-3">
                <DynamicForm form={followUpForm}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormItem
                                render="date-time-picker"
                                name="injectionCompleteTime"
                                label={t(i18n.translationKey.injectionCompleteTime)}
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormItem
                                render="checkbox"
                                name="confirmFollowUp"
                                label={t(i18n.translationKey.confirmFollowUp)}
                                defaultValue={true}
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
                                <Box
                                    sx={{
                                        pl: 20,
                                        "& .MuiFormGroup-root": {
                                            gap: 8,
                                            flexDirection: "row",
                                        },
                                    }}
                                >
                                    <FormItem
                                        render="radio-group"
                                        name="testResult"
                                        options={[
                                            { label: `1. ${t(i18n.translationKey.negative)}`, value: "negative" },
                                            { label: `2. ${t(i18n.translationKey.positive)}`, value: "positive" },
                                        ]}
                                        defaultValue="negative"
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={12}>
                            <FormItem
                                render="checkbox"
                                name="reactionOccurred"
                                label={t(i18n.translationKey.reactionOccurred)}
                                defaultValue={true}
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormItem
                                render="date-time-picker"
                                name="reactionAfterInjectionTime"
                                label={t(i18n.translationKey.reactionAfterInjectionTime)}
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
                                        defaultValue={["fever"]}
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
                            />
                        </Grid>
                    </Grid>

                    <Box className="mt-4">
                        <AgDataGrid
                            columnDefs={reactionColumnDefs}
                            rowData={[]}
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
