import { Box, Button, Grid, Stack, TextField, TextFieldProps, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";

const ReadonlyTextField: React.FC<TextFieldProps> = ({ slotProps, ...props }) => {
    return (
        <TextField
            slotProps={{
                input: {
                    readOnly: true,
                },
                inputLabel: {
                    shrink: true,
                },
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
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={6}>
                                <ReadonlyTextField label={t(i18n.translationKey.vaccinationNumber)} />
                            </Grid>
                            <Grid size={6}>
                                <SearchBox onChange={handleSearch} placeholder={t(i18n.translationKey.search)} />
                            </Grid>
                        </Grid>
                        <Button fullWidth variant="contained" size="small">
                            {t(i18n.translationKey.refreshList)}
                        </Button>
                        <AgDataGrid
                            columnDefs={patientColumnDefs}
                            rowData={[]}
                            {...patientAgGrid}
                            className="h-[100px]"
                        />
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
                    <Stack spacing={2} className="flex-grow">
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={6}>
                                <FormItem
                                    render="select"
                                    name="batchCode"
                                    label={t(i18n.translationKey.batchNumber)}
                                    options={[]}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={6}>
                                <Typography className="font-bold">HD: {t(i18n.translationKey.expiryDate)}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} alignItems="center">
                            <Grid size={6}>
                                <ReadonlyTextField label={t(i18n.translationKey.testStartTime)} />
                            </Grid>
                            <Grid size={6}>
                                <ReadonlyTextField label={t(i18n.translationKey.injectionDate)} />
                            </Grid>
                        </Grid>

                        <ReadonlyTextField label={t(i18n.translationKey.note)} multiline rows={2} />

                        <Button variant="contained">{t(i18n.translationKey.transferSelectedDose)}</Button>
                        <Button variant="contained">{t(i18n.translationKey.confirmSelectedDose)}</Button>

                        <Box mt={2} display="flex" flexWrap="wrap" gap={4} width="100%">
                            <Button variant="outlined">{t(i18n.translationKey.sendToCustomer)}</Button>
                            <Button variant="outlined">{t(i18n.translationKey.confirmStart)}</Button>
                            <Button variant="outlined">{t(i18n.translationKey.confirmInjectedToday)}</Button>
                            <Button variant="outlined">{t(i18n.translationKey.cancelConfirm)}</Button>
                            <Button variant="outlined">{t(i18n.translationKey.saveNote)}</Button>
                            <Button variant="outlined">{t(i18n.translationKey.vaccinationHistory)}</Button>
                        </Box>

                        <AgDataGrid
                            columnDefs={vaccineColumnDefs}
                            rowData={[]}
                            {...vaccineAgGrid}
                            className="ag-theme-alpine h-[300px]"
                        />
                    </Stack>
                </DynamicForm>
            </Box>
        </Box>
    );
};

export default VaccinationPage;
