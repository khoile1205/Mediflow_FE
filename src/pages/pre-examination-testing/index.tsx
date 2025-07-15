import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { PreExaminationRow } from "./types";
import { useMutationUpdatePreExaminationResult } from "~/services/pre-examination/hooks/mutations/use-mutation-update-pre-examination-result";
import { showToast } from "~/utils";

interface PreExaminationTestingPageProps {
    open: boolean;
    onClose: () => void;
    rowData: PreExaminationRow[];
}

const PreExaminationTestingPage: React.FC<PreExaminationTestingPageProps> = ({ open, onClose, rowData = [] }) => {
    const { t } = useTranslation();
    const resultForm = useForm();
    const resultAgGrid = useAgGrid<PreExaminationRow>({ rowSelection: "multiple" });

    const { mutateAsync: updateTestResult } = useMutationUpdatePreExaminationResult();

    const handleSubmitResult = async () => {
        const selectedRows = resultAgGrid.gridApi?.getSelectedRows?.();

        if (!selectedRows || selectedRows.length === 0) {
            showToast.warning(t(i18n.translationKey.selectAtLeastOneDose));
            return;
        }

        const testResult = resultForm.getValues("testResult");

        try {
            await Promise.all(
                selectedRows.map((row) =>
                    updateTestResult({
                        receptionVaccinationId: row.receptionVaccinationId,
                        data: {
                            receptionVaccinationId: row.receptionVaccinationId,
                            testEntryResult: testResult,
                        },
                    }),
                ),
            );

            selectedRows.forEach((row) => {
                const index = rowData.findIndex((r) => r.receptionVaccinationId === row.receptionVaccinationId);
                if (index !== -1) {
                    rowData[index].testResultEntry = testResult;
                }
            });

            (resultAgGrid.gridApi as any)?.setRowData([...rowData]);

            showToast.success(t(i18n.translationKey.addVaccineToPreExaminationSuccess));
        } catch (error) {
            showToast.error(t(i18n.translationKey.addVaccineToPreExaminationFailed));
        }
    };

    const columnDefs: ColDef<PreExaminationRow>[] = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            pinned: "left",
        },
        { field: "patientName", headerName: t(i18n.translationKey.patientName) },
        { field: "vaccineName", headerName: t(i18n.translationKey.vaccineSerumName) },
        { field: "isConfirmed", headerName: t(i18n.translationKey.vaccinationConfirmation) },
        { field: "vaccinationTestDate", headerName: t(i18n.translationKey.testStartTime) },
        { field: "testResultEntry", headerName: t(i18n.translationKey.testResult) },
        { field: "doctorName", headerName: t(i18n.translationKey.enteredByDoctor) },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Typography variant="h6">{t(i18n.translationKey.testResult)}</Typography>
            </DialogTitle>
            <DialogContent className="no-scrollbar h-full">
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
                                            { label: t(i18n.translationKey.negative), value: "Âm tính" },
                                            { label: t(i18n.translationKey.positive), value: "Dương tính" },
                                        ]}
                                        defaultValue="Âm tính"
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} display="flex" alignItems="stretch">
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ height: "100%", boxShadow: 1, fontWeight: 600 }}
                                onClick={handleSubmitResult}
                            >
                                {t(i18n.translationKey.inputTestResult)}
                            </Button>
                        </Grid>
                    </Grid>

                    <AgDataGrid
                        columnDefs={columnDefs}
                        rowData={rowData}
                        {...resultAgGrid}
                        onGridReady={(params) => {
                            resultAgGrid.gridApi = params.api;
                            params.api.sizeColumnsToFit();
                        }}
                    />
                </DynamicForm>
            </DialogContent>
        </Dialog>
    );
};

export default PreExaminationTestingPage;
