import { Box, Button, Grid, Stack, TextField, TextFieldProps } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";

const ReadonlyTextField: React.FC<TextFieldProps> = ({ slotProps, ...props }) => {
    return (
        <TextField
            slotProps={{
                input: { readOnly: true },
                inputLabel: { shrink: true },
                ...slotProps,
            }}
            variant="outlined"
            size="small"
            fullWidth
            {...props}
        />
    );
};

const VaccinationPage: React.FC = () => {
    const { t } = useTranslation();
    const patientForm = useForm();
    const vaccineForm = useForm();

    const patientAgGrid = useAgGrid({});
    const patientColumnDefs = React.useMemo(
        () => [{ field: "patientName", headerName: t(i18n.translationKey.patientName) }],
        [],
    );

    const vaccineAgGrid = useAgGrid({ rowSelection: "multiple" });
    const vaccineColumnDefs: ColDef<any>[] = React.useMemo(
        () => [
            { checkboxSelection: true, headerCheckboxSelection: true, width: 50, pinned: true, resizable: false },
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
                field: "injectionStatus",
                headerName: t(i18n.translationKey.vaccinationConfirmation),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "testResult",
                headerName: t(i18n.translationKey.testResult),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
            {
                field: "doctor",
                headerName: t(i18n.translationKey.instructedDoctor),
                headerStyle: { backgroundColor: "#98D2C0" },
            },
        ],
        [],
    );

    const handleSearch = (value: string) => {
        console.log("Search value:", value);
    };

    return (
        <Box className="flex h-full min-h-[600px]">
            <DynamicForm form={patientForm}>
                <Box className="flex h-full basis-1/3 flex-col bg-[#F6F8D5] p-3">
                    <Stack spacing={2} className="flex-grow">
                        <ReadonlyTextField label={t(i18n.translationKey.vaccinationNumber)} />

                        <Grid container spacing={2} alignItems="center">
                            <Grid size={8}>
                                <TextField
                                    label={t(i18n.translationKey.findPatient)}
                                    placeholder={t(i18n.translationKey.findPatient)}
                                    size="small"
                                    fullWidth
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </Grid>
                            <Grid size={4}>
                                <Button
                                    fullWidth
                                    sx={{
                                        backgroundColor: "white",
                                        color: "black",
                                        fontWeight: 400,
                                        borderRadius: "12px",
                                        border: "1px solid black",
                                        textTransform: "none",
                                        px: 2,
                                        py: 1,
                                        minWidth: "unset",
                                        width: "fit-content",
                                        height: "40px",
                                        minHeight: "40px",
                                    }}
                                >
                                    {t(i18n.translationKey.refreshList)}
                                </Button>
                            </Grid>
                        </Grid>

                        <AgDataGrid
                            columnDefs={patientColumnDefs}
                            rowData={[]}
                            {...patientAgGrid}
                            className="h-[100px]"
                        />

                        <ReadonlyTextField label={t(i18n.translationKey.vaccinationNumber)} />
                        <ReadonlyTextField label={t(i18n.translationKey.medicalCode)} />
                        <ReadonlyTextField label={t(i18n.translationKey.patientName)} />

                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <ReadonlyTextField label={t(i18n.translationKey.dateOfBirth)} />
                            </Grid>
                            <Grid size={6}>
                                <ReadonlyTextField label={t(i18n.translationKey.gender)} />
                            </Grid>
                        </Grid>

                        <ReadonlyTextField label={t(i18n.translationKey.weight)} />
                    </Stack>
                </Box>
            </DynamicForm>

            <Box className="flex h-full flex-1 flex-col p-3">
                <DynamicForm form={vaccineForm}>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Stack spacing={2}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={7}>
                                        <FormItem
                                            render="select"
                                            name="batchCode"
                                            label={t(i18n.translationKey.batchNumber)}
                                            options={[]}
                                        />
                                    </Grid>
                                    <Grid size={5}>
                                        <ReadonlyTextField label={t(i18n.translationKey.expiryDate)} />
                                    </Grid>
                                    <Grid size={12}>
                                        <ReadonlyTextField label={t(i18n.translationKey.testStartTime)} />
                                    </Grid>
                                    <Grid size={12}>
                                        <ReadonlyTextField label={t(i18n.translationKey.injectionDate)} />
                                    </Grid>
                                    <Grid size={12}>
                                        <ReadonlyTextField label={t(i18n.translationKey.note)} multiline rows={2} />
                                    </Grid>
                                </Grid>

                                <Button fullWidth sx={{ textTransform: "none" }}>
                                    {t(i18n.translationKey.transferSelectedDose)}
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid size={4}>
                            <Stack spacing={3.35}>
                                <Button>{t(i18n.translationKey.sendToCustomer)}</Button>
                                <Button>{t(i18n.translationKey.confirmStart)}</Button>
                                <Button>{t(i18n.translationKey.confirmInjectedToday)}</Button>
                                <Button>{t(i18n.translationKey.saveNote)}</Button>
                                <Button>{t(i18n.translationKey.confirmSelectedDose)}</Button>
                            </Stack>
                        </Grid>

                        <Grid size={2}>
                            <Box height="100%" display="flex" flexDirection="column" justifyContent="center">
                                <Stack spacing={11}>
                                    <Button>{t(i18n.translationKey.cancelConfirm)}</Button>
                                    <Button>{t(i18n.translationKey.vaccinationHistory)}</Button>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box mt={2}>
                        <AgDataGrid
                            columnDefs={vaccineColumnDefs}
                            rowData={[]}
                            {...vaccineAgGrid}
                            className="ag-theme-alpine h-[300px]"
                        />
                    </Box>
                </DynamicForm>
            </Box>
        </Box>
    );
};

export default VaccinationPage;
