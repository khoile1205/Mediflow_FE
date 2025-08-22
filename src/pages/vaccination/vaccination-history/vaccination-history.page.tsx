import { Box, Grid, Stack, Typography, Button } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import i18n from "~/configs/i18n";
import { formatDate } from "~/utils/date-time";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { QueryKey } from "~/constants/query-key";
import { useQueryGetAllVaccinationHistory } from "~/services/vaccination/hooks/queries";
import { VaccinationHistoryItem } from "../types";
import { usePagination } from "~/hooks";
import FormItem from "~/components/form/form-item";
import DynamicForm from "~/components/form/dynamic-form";
import { useForm } from "~/components/form/hooks/use-form";

interface VaccinationHistoryFilterForm {
    fromDate: string;
    toDate: string;
    patientName: string;
}

export const VaccinationHistory: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // Initialize filter form
    const filterForm = useForm<VaccinationHistoryFilterForm>({
        defaultValues: {
            fromDate: (() => {
                const date = new Date();
                date.setMonth(date.getMonth() - 1);
                return formatDate(date, DATE_TIME_FORMAT["yyyy-MM-dd"]);
            })(),
            toDate: formatDate(new Date(), DATE_TIME_FORMAT["yyyy-MM-dd"]),
            patientName: "",
        },
    });

    // Watch form values for API calls
    const formValues = filterForm.watch();
    const { fromDate, toDate, patientName } = formValues;

    const { handlePageChange, pageIndex, pageSize } = usePagination();

    const {
        data: { vaccinationHistory },
        isLoading,
        refetch,
    } = useQueryGetAllVaccinationHistory({ pageIndex, pageSize }, fromDate, toDate, patientName);

    const vaccinationHistoryGrid = useAgGrid({
        rowSelection: "multiple",
    });

    // Enhanced column definitions with patient name
    const vaccinationHistoryColumnDefs: ColDef<VaccinationHistoryItem>[] = [
        {
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: true,
            resizable: false,
        },
        {
            field: "patientName",
            headerName: t(i18n.translationKey.patientName),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            width: 200,
            pinned: "left",
        },
        {
            field: "patientCode",
            headerName: t(i18n.translationKey.medicalCode),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            width: 200,
        },
        {
            field: "medicineName",
            headerName: t(i18n.translationKey.vaccineSerumName),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            width: 200,
        },
        {
            field: "doseNumber",
            headerName: t(i18n.translationKey.doseNumber),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            cellClass: "ag-cell-center",
            width: 100,
        },
        {
            field: "vaccinationTestDate",
            headerName: t(i18n.translationKey.testDate),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            cellClass: "ag-cell-center",
            width: 120,
            cellRenderer: (param: { value: Date }) => {
                const date = param.value as Date;
                return date ? formatDate(date, DATE_TIME_FORMAT["dd/MM/yyyy"]) : "";
            },
        },
        {
            field: "vaccinationDate",
            headerName: t(i18n.translationKey.injectionDate),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            cellClass: "ag-cell-center",
            width: 120,
            cellRenderer: (param: { value: Date }) => {
                const date = param.value as Date;
                return date ? formatDate(date, DATE_TIME_FORMAT["dd/MM/yyyy"]) : "";
            },
        },
        {
            field: "vaccinationConfirmation",
            headerName: t(i18n.translationKey.vaccinationConfirmation),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            cellClass: "ag-cell-center",
            width: 150,
            cellRenderer: (param: { value: boolean }) => {
                return param.value ? t(i18n.translationKey.isInjected) : t(i18n.translationKey.notInjected);
            },
        },
        {
            field: "doctorName",
            headerName: t(i18n.translationKey.instructedDoctor),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            width: 200,
        },
        {
            field: "hasIssue",
            headerName: t(i18n.translationKey.hasIssue),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            cellClass: "ag-cell-center",
            width: 150,
            cellRenderer: (param: { value: boolean }) => {
                return param.value ? t(i18n.translationKey.hasIssue) : t(i18n.translationKey.noIssue);
            },
        },
        {
            field: "issueNote",
            headerName: t(i18n.translationKey.issueNote),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            width: 200,
        },
        {
            field: "issueDate",
            headerName: t(i18n.translationKey.issueDate),
            headerStyle: {
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "#98d2c0",
                borderColor: "#98d2c0",
            },
            cellClass: "ag-cell-center",
            width: 120,
            cellRenderer: (param: { value: Date }) => {
                const date = param.value as Date;
                return date ? formatDate(date, DATE_TIME_FORMAT["dd/MM/yyyy"]) : "";
            },
        },
    ];

    // Sort data by vaccination date descending (newest first)
    const sortedVaccinationHistory = React.useMemo(() => {
        if (!vaccinationHistory?.data || !Array.isArray(vaccinationHistory.data)) return [];

        return [...vaccinationHistory.data].sort((a, b) => {
            const dateA = new Date(a.vaccinationDate);
            const dateB = new Date(b.vaccinationDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [vaccinationHistory]);

    const handleSearch = () => {
        refetch();
    };

    const handleResetFilter = () => {
        const defaultFromDate = new Date();
        defaultFromDate.setMonth(defaultFromDate.getMonth() - 1);

        filterForm.setValue("fromDate", formatDate(defaultFromDate, DATE_TIME_FORMAT["yyyy-MM-dd"]));
        filterForm.setValue("toDate", formatDate(new Date(), DATE_TIME_FORMAT["yyyy-MM-dd"]));
        filterForm.setValue("patientName", "");

        // Refetch data after reset
        setTimeout(() => {
            refetch();
        }, 100);
    };

    const handleRefresh = () => {
        // Invalidate all vaccination related queries
        queryClient.invalidateQueries({
            queryKey: [QueryKey.VACCINATION.GET_ALL_VACCINATION_HISTORY],
        });
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 1, p: 3 }}>
                <Stack spacing={3}>
                    <Typography variant="h5" className="font-bold">
                        {t(i18n.translationKey.vaccinationHistory)}
                    </Typography>

                    {/* Filter Section */}
                    <Box className="border p-4" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                        <DynamicForm form={filterForm}>
                            <Typography variant="h6" className="mb-3">
                                {t(i18n.translationKey.search)} & {t(i18n.translationKey.filter)}
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={3}>
                                    <FormItem
                                        render="date-picker"
                                        name="fromDate"
                                        label={t(i18n.translationKey.fromDate)}
                                        maxDate={
                                            filterForm.watch("toDate")
                                                ? new Date(filterForm.watch("toDate"))
                                                : undefined
                                        }
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormItem
                                        render="date-picker"
                                        name="toDate"
                                        label={t(i18n.translationKey.toDate)}
                                        minDate={
                                            filterForm.watch("fromDate")
                                                ? new Date(filterForm.watch("fromDate"))
                                                : undefined
                                        }
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormItem
                                        render="text-input"
                                        name="patientName"
                                        label={`${t(i18n.translationKey.search)} ${t(i18n.translationKey.patientName)}`}
                                        size="small"
                                        placeholder={`${t(i18n.translationKey.patientName)}`}
                                    />
                                </Grid>
                                <Grid size={2}>
                                    <Stack direction="row" spacing={1} className="mb-4">
                                        <Button variant="contained" onClick={handleSearch} size="small">
                                            {t(i18n.translationKey.search)}
                                        </Button>
                                        <Button variant="outlined" onClick={handleResetFilter} size="small">
                                            {t(i18n.translationKey.reset)}
                                        </Button>
                                        <Button variant="contained" onClick={handleRefresh} size="small">
                                            {t(i18n.translationKey.refreshList)}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DynamicForm>
                    </Box>

                    {/* Data Grid */}
                    <Box>
                        <Stack spacing={2}>
                            <AgDataGrid
                                columnDefs={vaccinationHistoryColumnDefs}
                                rowData={sortedVaccinationHistory}
                                loading={isLoading}
                                pagination
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                                totalItems={vaccinationHistory.totalItems}
                                onPageChange={handlePageChange}
                                className="mt-2"
                                defaultColDef={{
                                    sortable: true,
                                    filter: true,
                                    resizable: true,
                                }}
                                {...vaccinationHistoryGrid}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default VaccinationHistory;
