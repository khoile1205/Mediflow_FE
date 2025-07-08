import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";

interface PreExaminationTestingPageProps {
    open: boolean;
    onClose: () => void;
}

const PreExaminationTestingPage: React.FC<PreExaminationTestingPageProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const resultForm = useForm();
    const resultAgGrid = useAgGrid({ rowSelection: "multiple" });

    const rowData = [{}];

    const columnDefs: ColDef[] = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            pinned: "left",
        },
        { field: "patientName", headerName: t(i18n.translationKey.patientName) },
        { field: "vaccineName", headerName: t(i18n.translationKey.vaccineSerumName) },
        { field: "confirmation", headerName: t(i18n.translationKey.vaccinationConfirmation) },
        { field: "startTime", headerName: t(i18n.translationKey.testStartTime) },
        { field: "testResult", headerName: t(i18n.translationKey.testResult) },
        { field: "enteredBy", headerName: t(i18n.translationKey.enteredByDoctor) },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            // PaperProps={{
            //     sx: {
            //         height: "80%",
            //         maxHeight: "80vh",
            //         overflow: "auto",
            //     },
            // }}
        >
            <DialogTitle>
                <Typography variant="h6">{t(i18n.translationKey.testResult)}</Typography>
            </DialogTitle>
            <DialogContent className="no-scrollbar h-full">
                {/* <Grid container spacing={2} className="mb-4">
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
                            onClick={onClose}
                        />
                    </Grid>
                </Grid> */}

                <DynamicForm form={resultForm}>
                    <Grid container spacing={2} className="my-4" alignItems="stretch">
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
                                            { label: `${t(i18n.translationKey.negative)}`, value: "negative" },
                                            { label: `${t(i18n.translationKey.positive)}`, value: "positive" },
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

                    <AgDataGrid columnDefs={columnDefs} rowData={rowData} {...resultAgGrid} />
                </DynamicForm>
            </DialogContent>
        </Dialog>
    );
};

export default PreExaminationTestingPage;
