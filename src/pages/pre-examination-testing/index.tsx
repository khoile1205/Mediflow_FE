import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { useMutationUpdatePreExaminationResult } from "~/services/pre-examination/hooks/mutations/use-mutation-update-pre-examination-result";
import { PreExaminationMedicine } from "~/services/pre-examination/infras/types";
import { MedicineVaccinationInformation } from "~/services/vaccination/infras";
import { showToast } from "~/utils";
import { PreExaminationRow } from "./types";

interface PreExaminationTestingPageProps {
    open: boolean;
    onClose: () => void;
    receptionId: number;
    plannedInjectVaccines: MedicineVaccinationInformation[];
    preTestingVaccines: PreExaminationMedicine[];
}

const PreExaminationTestingPage: React.FC<PreExaminationTestingPageProps> = ({
    open,
    onClose,
    receptionId,
    // plannedInjectVaccines,
    preTestingVaccines,
}) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
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

        // const vaccineWithSamePreTest = plannedInjectVaccines.filter(
        //     (vaccine) => vaccine.medicineId === selectedRows[0].
        // );

        try {
            await Promise.all(
                selectedRows.map(
                    async (row) =>
                        await updateTestResult({
                            receptionVaccinationId: row.receptionVaccinationId,
                            data: {
                                receptionVaccinationId: row.receptionVaccinationId,
                                testEntryResult: testResult,
                            },
                        }),
                ),
            );
            queryClient.invalidateQueries({
                queryKey: [QueryKey.VACCINATION.GET_MEDICINE_VACCINATION_LIST_BY_RECEPTION_ID, receptionId],
            });
            showToast.success(t(i18n.translationKey.updateTestResultSuccessfully));
            onClose();
        } catch (error) {
            showToast.error(t(i18n.translationKey.updateTestResultFailed));
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
        {
            field: "vaccinationTestDate",
            headerName: t(i18n.translationKey.testStartTime),
            valueFormatter: ({ value }) => {
                if (!value) return "";
                const date = new Date(value);
                const pad = (n: number) => n.toString().padStart(2, "0");
                return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            },
        },
        {
            field: "testResultEntry",
            headerName: t(i18n.translationKey.testResult),
            valueGetter: (params) => {
                if (!params.data.testResultEntry) return t(i18n.translationKey.notTested);
                return params.data.testResultEntry === "negative"
                    ? t(i18n.translationKey.negative)
                    : t(i18n.translationKey.positive);
            },
        },
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
                                            {
                                                label: t(i18n.translationKey.negative),
                                                value: "negative",
                                            },
                                            {
                                                label: t(i18n.translationKey.positive),
                                                value: "positive",
                                            },
                                        ]}
                                        defaultValue="negative"
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
                        rowData={preTestingVaccines}
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
