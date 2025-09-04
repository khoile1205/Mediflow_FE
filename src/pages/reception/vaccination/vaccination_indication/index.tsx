import { AddCircle, Delete, Update } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { ColDef, RowSelectedEvent } from "ag-grid-community";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { Medicine } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryGetMedicinesWithPagination } from "~/services/medicine/hooks/queries";
import {
    useMutationAddVaccinationReception,
    useMutationDeleteVaccinationReception,
    useMutationUpdateVaccinationReception,
} from "~/services/reception/hooks/mutations";
import { useQueryVaccinationReceptionByReceptionId } from "~/services/reception/hooks/queries";
import { VaccinationIndicateReception } from "~/services/reception/infras/types";
import { showToast } from "~/utils";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";
import { VaccinationIndicateReceptionFormValues } from "./types";

interface VaccinationIndicationProps {
    receptionId?: number;
    isPrescreening?: boolean;
    isAllowedToVaccinate?: boolean;
    form: UseFormReturn<VaccinationIndicateReceptionFormValues>;
}

export const VaccinationIndication: React.FC<VaccinationIndicationProps> = ({ receptionId, isPrescreening, form }) => {
    const { t } = useTranslation();
    const { handlePageChange, pageIndex, pageSize } = usePagination();

    const [selectedRow, setSelectedRow] = React.useState<VaccinationIndicateReception | null>(null);
    const [searchVaccineTerm, setSearchVaccineTerm] = React.useState<string>("");

    const {
        data: { listMedicines, totalItems },
    } = useQueryGetMedicinesWithPagination({ pageIndex, pageSize, searchKeyword: searchVaccineTerm });

    const { listVaccinations } = useQueryVaccinationReceptionByReceptionId(receptionId);

    const { mutateAsync: addVaccinationReception } = useMutationAddVaccinationReception();
    const { mutateAsync: updateVaccinationReception } = useMutationUpdateVaccinationReception();
    const { mutateAsync: deleteVaccinationReception } = useMutationDeleteVaccinationReception();

    const agGrid = useAgGrid<VaccinationIndicateReception>({});
    const columnDefs: ColDef<VaccinationIndicateReception>[] = [
        {
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: true,
            resizable: false,
        },
        { field: "vaccineTypeName", headerName: t(i18n.translationKey.vaccineSerumType) },
        { field: "vaccineName", headerName: t(i18n.translationKey.vaccineSerumName) },
        { field: "quantity", headerName: t(i18n.translationKey.quantity), cellClass: "ag-cell-center", width: 150 },
        {
            field: "isReadyToUse",
            headerName: t(i18n.translationKey.allowUsage),
            cellClass: "ag-selection-checkbox-center",
            width: 150,
        },
        {
            field: "unitPrice",
            headerName: t(i18n.translationKey.unitPrice),
            valueFormatter: (params) => formatCurrencyVND(params.data.quantity * params.data.unitPrice),
            cellClass: "ag-cell-center",
            width: 150,
        },
        {
            field: "scheduledDate",
            headerName: t(i18n.translationKey.usageDate),
            valueFormatter: ({ value }) => {
                if (!value) return t(i18n.translationKey.notAvailable);
                return formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]);
            },
            cellClass: "ag-cell-center",
        },
        {
            field: "appointmentDate",
            headerName: t(i18n.translationKey.appointmentDate),
            valueFormatter: ({ value }) => {
                if (!value) return t(i18n.translationKey.notAvailable);
                return formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]);
            },
            cellClass: "ag-cell-center",
        },
        {
            field: "isConfirmed",
            headerName: t(i18n.translationKey.vaccinationConfirmation),
            valueGetter: (params) => {
                return params.data.isConfirmed ? t(i18n.translationKey.confirmed) : t(i18n.translationKey.notInjected);
            },
            cellClass: "ag-cell-center",
        },
        { field: "note", headerName: t(i18n.translationKey.note) },
    ];

    const handleAddNewVaccination = async (data: VaccinationIndicateReceptionFormValues) => {
        // if (data.isReadyToUse) {
        //     showToast.error(t(i18n.translationKey.vaccinationNotAllowed));
        //     return;
        // }

        if (!data.isReadyToUse) {
            data.appointmentDate = data.scheduledDate;
        }

        await addVaccinationReception({ receptionId, data });

        form.reset();
        setSelectedRow(null);
    };

    const handleDeleteVaccination = async () => {
        if (!selectedRow) {
            showToast.error(t(i18n.translationKey.pleaseSelectRowToDelete));
            return;
        }

        const selectedRows = agGrid.gridApi.getSelectedRows();
        const idsToDelete = selectedRows.map((row) => row.id);

        await deleteVaccinationReception({ receptionId, listServiceIds: idsToDelete });

        form.reset();
        setSelectedRow(null);
    };

    const handleUpdateVaccinationIndication = async () => {
        const selectedRow = agGrid.gridApi.getSelectedRows()?.[0];

        if (!selectedRow) {
            return;
        }

        // if (!isAllowedToVaccinate && form.getValues("isReadyToUse")) {
        //     showToast.error(t(i18n.translationKey.vaccinationNotAllowed));
        //     return;
        // }
        let appointmentDate = form.getValues("appointmentDate");

        if (!appointmentDate) {
            appointmentDate = !form.getValues("isReadyToUse") ? form.getValues("scheduledDate") : null;
        }

        const data: VaccinationIndicateReceptionFormValues = {
            vaccineId: form.getValues("vaccineId"),
            id: form.getValues("id"),
            quantity: form.getValues("quantity"),
            appointmentDate,
            note: form.getValues("note"),
            isReadyToUse: form.getValues("isReadyToUse"),
            scheduledDate: form.getValues("scheduledDate"),
        };

        await updateVaccinationReception({
            receptionId,
            data,
        });
        form.reset();
        setSelectedRow(null);
        agGrid.gridApi.deselectAll();
    };

    const handleSelectionChanged = () => {
        const selectedRow = agGrid.gridApi.getSelectedRows()?.[0] || null;

        if (!selectedRow) {
            setSelectedRow(null);
            form.reset();
            return;
        }

        setSelectedRow(selectedRow);
        form.setValue("id", selectedRow.id);
        form.setValue("vaccineId", selectedRow.vaccineId);
        form.setValue("vaccineName", selectedRow.vaccineName);
        form.setValue("quantity", selectedRow.quantity);
        form.setValue("appointmentDate", selectedRow.appointmentDate);
        form.setValue("note", selectedRow.note);
        form.setValue("isReadyToUse", selectedRow.isReadyToUse);
        form.setValue("scheduledDate", selectedRow.scheduledDate);
    };

    const handleSearch = (searchValue: string) => {
        setSearchVaccineTerm(searchValue);
    };

    const handleSelectMedicine = (selectedRow: RowSelectedEvent<Medicine>) => {
        if (selectedRow) {
            form.setValue("vaccineId", selectedRow.data.id);
            form.setValue("vaccineName", selectedRow.data.medicineName);
        }
    };

    React.useEffect(() => {
        if (form.watch("isReadyToUse")) {
            form.setValue("scheduledDate", new Date(Date.now() + 30 * 60 * 1000));
            form.formState.errors.scheduledDate = undefined;
        }
    }, [form.watch("isReadyToUse")]);
    return (
        <DynamicForm form={form}>
            <Stack spacing={2} className="pt-3">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        {t(i18n.translationKey.vaccinationIndication)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                        <Grid container spacing={2.5} alignItems="flex-start">
                            <Grid size={3}>
                                <FormItem
                                    disabled={!receptionId || !!selectedRow}
                                    render="data-grid"
                                    name="vaccineName"
                                    required
                                    label={t(i18n.translationKey.vaccine)}
                                    placeholder={t(i18n.translationKey.selectVaccine)}
                                    columnDefs={[
                                        {
                                            field: "medicineCode",
                                            headerName: t(i18n.translationKey.medicalCode),
                                            width: 100,
                                        },
                                        {
                                            field: "medicineName",
                                            headerName: t(i18n.translationKey.medicineName),
                                            width: 250,
                                        },
                                        {
                                            field: "unit",
                                            headerName: t(i18n.translationKey.unit),
                                            cellClass: "ag-cell-center",
                                            width: 100,
                                        },
                                        {
                                            field: "currentStock",
                                            headerName: t(i18n.translationKey.quantity),
                                            cellClass: "ag-cell-center",
                                            width: 100,
                                        },
                                        {
                                            field: "concentration",
                                            headerName: t(i18n.translationKey.concentration),
                                            width: 100,
                                        },
                                        {
                                            field: "routeOfAdministration",
                                            headerName: t(i18n.translationKey.injectionRoute),
                                            cellClass: "ag-cell-center",
                                            width: 150,
                                        },
                                        {
                                            field: "isRequiredTestingBeforeUse",
                                            headerName: t(i18n.translationKey.preTestingRequired),
                                            cellClass: "ag-selection-checkbox-center",
                                            width: 100,
                                        },
                                        {
                                            field: "unitPrice",
                                            headerName: t(i18n.translationKey.unitPrice),
                                            valueFormatter: ({ value }) => formatCurrencyVND(value ?? 0),
                                            cellClass: "ag-cell-center",
                                            width: 150,
                                        },
                                    ]}
                                    rowData={listMedicines}
                                    pagination
                                    pageIndex={pageIndex}
                                    pageSize={pageSize}
                                    totalItems={totalItems}
                                    onRowSelected={handleSelectMedicine}
                                    onPageChange={handlePageChange}
                                    onSearch={handleSearch}
                                    displayField="medicineName"
                                    valueField="id"
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    disabled={!receptionId}
                                    render="input-number"
                                    name="quantity"
                                    required
                                    label={t(i18n.translationKey.quantity)}
                                    placeholder="0"
                                    minNumber={1}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    disabled={!receptionId || form.watch("isReadyToUse")}
                                    render="date-time-picker"
                                    required
                                    name="scheduledDate"
                                    minDate={new Date()}
                                    datePickerProps={{
                                        dateFormat: DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"],
                                    }}
                                    label={t(i18n.translationKey.injectionDate)}
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    disabled={!receptionId}
                                    render="text-input"
                                    name="note"
                                    label={t(i18n.translationKey.note)}
                                    placeholder={t(i18n.translationKey.note)}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    useFlexGap
                                    flexWrap="wrap"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Stack direction="row" spacing={1}>
                                        <ActionButton
                                            label={t(i18n.translationKey.addNew)}
                                            startIcon={<AddCircle />}
                                            size="small"
                                            disabled={!receptionId || (form.watch("isReadyToUse") && !isPrescreening)}
                                            variant="outlined"
                                            onClick={form.handleSubmit(handleAddNewVaccination)}
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                            }}
                                        />
                                        <ActionButton
                                            label={t(i18n.translationKey.update)}
                                            startIcon={<Update />}
                                            size="small"
                                            color="secondary"
                                            onClick={handleUpdateVaccinationIndication}
                                            variant="outlined"
                                            disabled={
                                                !receptionId ||
                                                !selectedRow ||
                                                selectedRow?.isConfirmed ||
                                                (form.watch("isReadyToUse") && !isPrescreening)
                                            }
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                            }}
                                        />
                                        <ActionButton
                                            label={t(i18n.translationKey.deleteSelectedIndications)}
                                            startIcon={<Delete />}
                                            size="small"
                                            disabled={!receptionId || !selectedRow || selectedRow?.isConfirmed}
                                            color="error"
                                            variant="outlined"
                                            onClick={handleDeleteVaccination}
                                            sx={{ borderRadius: 4, px: 2 }}
                                        />
                                    </Stack>
                                    <Box>
                                        {/* <Tooltip
                                            title={
                                                !isAllowedToVaccinate
                                                    ? t(i18n.translationKey.vaccinationNotAllowed)
                                                    : ""
                                            }
                                        > */}
                                        <Box>
                                            <FormItem
                                                render="checkbox"
                                                name="isReadyToUse"
                                                label={t(i18n.translationKey.useToday)}
                                                disabled={!receptionId}
                                            />
                                        </Box>
                                        {/* </Tooltip> */}
                                    </Box>

                                    <Stack direction="row" spacing={1}></Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        {t(i18n.translationKey.vaccinationIndicationList)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                        <AgDataGrid
                            columnDefs={columnDefs}
                            rowData={listVaccinations}
                            {...agGrid}
                            onRowSelected={handleSelectionChanged}
                        />
                    </Box>
                </Box>
            </Stack>
        </DynamicForm>
    );
};

export default VaccinationIndication;
