import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useForm } from "~/components/form/hooks/use-form";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import { ColDef } from "ag-grid-community";
import i18n from "~/configs/i18n";
import { ActionButton } from "~/components/common/action-button";
import { AddCircle, Edit, Save, Delete, Undo } from "@mui/icons-material";

const PreExaminationTestingPage: React.FC = () => {
    const { t } = useTranslation();
    const resultForm = useForm();
    const resultAgGrid = useAgGrid({});

    const columnDefs: ColDef[] = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
        },
        { field: "patientName", headerName: t(i18n.translationKey.patientName) },
        { field: "vaccineName", headerName: t(i18n.translationKey.vaccineSerumName) },
        { field: "confirmation", headerName: t(i18n.translationKey.vaccinationConfirmation) },
        { field: "startTime", headerName: t(i18n.translationKey.testStartTime) },
        { field: "testResult", headerName: t(i18n.translationKey.testResult) },
        { field: "enteredBy", headerName: t(i18n.translationKey.enteredByDoctor) },
    ];

    return (
        <Box
            className="flex h-full flex-col"
            sx={{
                p: 2,
                gap: 1,
            }}
        >
            <Grid container spacing={2} className="mb-4">
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.addNew)}
                        startIcon={<AddCircle />}
                        onClick={() => {}}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.edit)}
                        startIcon={<Edit />}
                        onClick={() => {}}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.save)}
                        startIcon={<Save />}
                        onClick={() => {}}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.delete)}
                        startIcon={<Delete />}
                        color="error"
                        onClick={() => {}}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <ActionButton
                        fullWidth
                        label={t(i18n.translationKey.cancel)}
                        startIcon={<Undo />}
                        variant="outlined"
                        onClick={() => {}}
                    />
                </Grid>
            </Grid>

            <DynamicForm form={resultForm}>
                <Grid container spacing={2} className="mb-4" alignItems="stretch">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                position: "relative",
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                borderRadius: "4px",
                                padding: "14px 12px 10px 12px",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    position: "absolute",
                                    top: "-8px",
                                    left: "12px",
                                    backgroundColor: "#fff",
                                    px: "4px",
                                    fontSize: "0.7rem",
                                    color: "rgba(0, 0, 0, 0.6)",
                                    fontWeight: 500,
                                    lineHeight: 1,
                                }}
                            >
                                {t(i18n.translationKey.testResult)}
                            </Typography>
                            <Box
                                sx={{
                                    pl: 1,
                                    pt: 0.5,
                                    "& .MuiFormGroup-root": {
                                        gap: 12,
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
                    <Grid
                        size={{ xs: 12, md: 6 }}
                        display="flex"
                        alignItems="stretch"
                        sx={{ pl: { md: 1 }, mt: { xs: 2, md: 0 } }}
                    >
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ height: "100%", boxShadow: 1, fontWeight: 600, fontSize: "0.875rem" }}
                            onClick={() => {}}
                        >
                            {t(i18n.translationKey.inputTestResult)}
                        </Button>
                    </Grid>
                </Grid>

                <AgDataGrid columnDefs={columnDefs} rowData={[]} {...resultAgGrid} />
            </DynamicForm>
        </Box>
    );
};

export default PreExaminationTestingPage;
