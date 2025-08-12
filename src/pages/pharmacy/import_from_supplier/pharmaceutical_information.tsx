import { Done, DoNotDisturb } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { ColDef, RowSelectedEvent, ValueFormatterParams, ValueGetterParams } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import { BaseOption } from "~/components/form/types/form-item";
import { toBaseOption } from "~/components/form/utils";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { Manufacture, ManufactureCountry, Medicine } from "~/entities/medicine";
import { usePagination } from "~/hooks";
import { useQueryGetAllManufactureCountries, useQueryGetAllManufacturers } from "~/services/inventory/hooks/queries";
import { useQueryGetMedicinesWithPagination } from "~/services/medicine/hooks/queries";
import { showToast } from "~/utils";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";
import { ImportMedicineFromSupplierDetail } from "./types";

interface ImportPharmaceuticalInformationProps {
    details: ImportMedicineFromSupplierDetail[];
    updateDetails: (details: ImportMedicineFromSupplierDetail[]) => void;
    disabled: boolean;
}

const defaultValues: ImportMedicineFromSupplierDetail = {
    index: 0,
    medicineId: null,
    medicineName: "",
    unit: "",
    quantity: 0,
    unitPrice: 0,
    batchNumber: "",
    expiryDate: null,
    sgk_CPNK: "",
    manufacturerId: 0,
    manufacturerName: "",
    countryId: 0,
    countryName: "",
    note: "",
    isFree: false,
};

const ImportPharmaceuticalInformation: React.FC<ImportPharmaceuticalInformationProps> = ({
    details,
    updateDetails,
    disabled,
}) => {
    const { t } = useTranslation();

    const { pageIndex, pageSize, handlePageChange } = usePagination();
    const [searchMedicineTerm, setSearchMedicineTerm] = React.useState<string>("");
    const {
        data: { listMedicines, totalItems },
    } = useQueryGetMedicinesWithPagination({
        pageIndex,
        pageSize,
        searchKeyword: searchMedicineTerm,
    });
    const {
        data: { manufacturers },
    } = useQueryGetAllManufacturers();
    const {
        data: { countries },
    } = useQueryGetAllManufactureCountries();

    const pharmaceuticalInformationForm = useForm<ImportMedicineFromSupplierDetail>({
        defaultValues,
    });

    const pharmaceuticalInformationAgGrid = useAgGrid<ImportMedicineFromSupplierDetail>({});
    const columnDefs: ColDef<ImportMedicineFromSupplierDetail>[] = [
        {
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 20,
            pinned: true,
            resizable: false,
        },
        { field: "medicineName", headerName: t(i18n.translationKey.medicineName), flex: 1 },
        { field: "unit", headerName: t(i18n.translationKey.unit), flex: 1 },
        {
            field: "quantity",
            headerName: t(i18n.translationKey.quantity),
            valueFormatter: (params: ValueFormatterParams<ImportMedicineFromSupplierDetail>) =>
                Number(params.value).toString(),
            flex: 1,
        },
        {
            field: "unitPrice",
            headerName: t(i18n.translationKey.unitPrice),
            valueGetter: (params: ValueGetterParams<ImportMedicineFromSupplierDetail>) => {
                const unitPrice = Number(params.data.unitPrice) || 0;
                return formatCurrencyVND(unitPrice);
            },
            flex: 1,
        },
        {
            field: "totalPrice",
            headerName: t(i18n.translationKey.totalAmount),
            valueGetter: (params: ValueGetterParams<ImportMedicineFromSupplierDetail>) => {
                const totalPrice = params.data.isFree ? 0 : params.data.quantity * params.data.unitPrice;
                return formatCurrencyVND(totalPrice);
            },
            flex: 1,
        },
        { field: "batchNumber", headerName: t(i18n.translationKey.batchNumber), flex: 1 },
        {
            field: "expiryDate",
            headerName: t(i18n.translationKey.expiryDate),
            valueFormatter: ({ value }) => formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy"]),
            flex: 1,
        },
        { field: "sgk_CPNK", headerName: t(i18n.translationKey.sgkCpnk), flex: 1 },
        { field: "manufacturerName", headerName: t(i18n.translationKey.manufacturer), flex: 1 },
        { field: "countryName", headerName: t(i18n.translationKey.countryOfOrigin), flex: 1 },
        { field: "note", headerName: t(i18n.translationKey.note), flex: 1 },
    ];

    const handleSelectedMedicine = (event: RowSelectedEvent<Medicine>) => {
        pharmaceuticalInformationForm.setValue("medicineId", event.data.id);
        pharmaceuticalInformationForm.setValue("medicineName", event.data.medicineName);
        pharmaceuticalInformationForm.setValue("unit", event.data.unit);
    };

    const handleSubmitPharmaceuticalInformation = () => {
        if (pharmaceuticalInformationAgGrid.gridApi.getSelectedRows().length > 0) {
            handleEditPharmaceuticalInformation();
        } else {
            handleAddNewPharmaceuticalInformation();
        }

        resetPharmaceuticalInformationForm();
    };
    const handleEditPharmaceuticalInformation = () => {
        const updatedPharmaceuticalInformation = pharmaceuticalInformationForm.getValues();
        const currentPharmaceuticals = [...details];

        const updatedPharmaceuticals = currentPharmaceuticals.map((pharmaceutical) =>
            pharmaceutical.index == updatedPharmaceuticalInformation.index
                ? { ...pharmaceutical, ...updatedPharmaceuticalInformation }
                : pharmaceutical,
        );

        updateDetails(updatedPharmaceuticals);
    };

    const handleAddNewPharmaceuticalInformation = () => {
        const newPharmaceuticalInformation = pharmaceuticalInformationForm.getValues();
        const currentPharmaceuticals = [...details];

        const newPharmaceuticals = [
            ...currentPharmaceuticals,
            { ...newPharmaceuticalInformation, index: currentPharmaceuticals.length + 1 },
        ];

        updateDetails(newPharmaceuticals);
    };

    const handleRemovePharmaceuticalInformation = () => {
        const selectedRows = pharmaceuticalInformationAgGrid.gridApi.getSelectedRows();
        if (selectedRows.length === 0) {
            showToast.error(t(i18n.translationKey.pleaseSelectRowToDelete));
            return;
        }

        const currentDetails = [...details];
        const updatedDetails = currentDetails.filter(
            (detail) => !selectedRows.some((row) => row.index == detail.index),
        );

        updateDetails(updatedDetails);
        resetPharmaceuticalInformationForm();
    };

    const resetPharmaceuticalInformationForm = () => {
        pharmaceuticalInformationForm.reset();
        if (pharmaceuticalInformationAgGrid.gridApi) {
            pharmaceuticalInformationAgGrid.gridApi.deselectAll();
        }
    };

    const handleSelectedManufacture = (_: React.SyntheticEvent, manufacturer: BaseOption) => {
        pharmaceuticalInformationForm.setValue("manufacturerId", manufacturer.value as number);
        pharmaceuticalInformationForm.setValue("manufacturerName", manufacturer.label);
    };

    const handleSelectedManufactureCountry = (_: React.SyntheticEvent, country: BaseOption) => {
        pharmaceuticalInformationForm.setValue("countryId", country.value as number);
        pharmaceuticalInformationForm.setValue("countryName", country.label);
    };

    const handleSelectedPharmaceuticalInformation = (event: RowSelectedEvent<ImportMedicineFromSupplierDetail>) => {
        if (event.source != "rowClicked" || !event.data) return;
        pharmaceuticalInformationForm.reset(event.data, {
            keepDefaultValues: true,
        });
    };

    const handleSearchMedicine = (searchValue: string) => {
        setSearchMedicineTerm(searchValue);
    };

    return (
        <DynamicForm form={pharmaceuticalInformationForm}>
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h6"
                    sx={{
                        backgroundColor: "primary.dark",
                        color: "white",
                        py: { xs: 2, sm: 3 },
                        pl: { xs: 2, sm: 4, md: 8 },
                        fontWeight: 600,
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                >
                    {t(i18n.translationKey.pharmaceuticalInformation)}
                </Typography>
                <Box
                    sx={{
                        borderColor: "primary.main",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderRadius: 2,
                        p: { xs: 2, sm: 3, md: 4 },
                        mt: 2,
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <FormItem
                                render="data-grid"
                                name="medicineId"
                                label={t(i18n.translationKey.medicineName)}
                                placeholder={t(i18n.translationKey.medicineName)}
                                onRowSelected={handleSelectedMedicine}
                                columnDefs={[
                                    {
                                        field: "medicineCode",
                                        headerName: t(i18n.translationKey.medicalCode),
                                        width: 100,
                                    },
                                    {
                                        field: "medicineName",
                                        headerName: t(i18n.translationKey.medicineName),
                                        width: 200,
                                    },
                                    {
                                        field: "unit",
                                        headerName: t(i18n.translationKey.unit),
                                        width: 100,
                                    },
                                ]}
                                rowData={listMedicines}
                                displayField="medicineName"
                                valueField="medicineId"
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                                totalItems={totalItems}
                                onPageChange={handlePageChange}
                                pagination
                                required
                                onSearch={handleSearchMedicine}
                                disabled={disabled}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                            <FormItem
                                render="input-number"
                                name="quantity"
                                label={t(i18n.translationKey.quantity)}
                                placeholder={t(i18n.translationKey.quantity)}
                                minNumber={0}
                                required
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                            <FormItem
                                render="input-number"
                                name="unitPrice"
                                label={t(i18n.translationKey.unitPrice)}
                                placeholder={t(i18n.translationKey.unitPrice)}
                                minNumber={0}
                                slotProps={{
                                    input: {
                                        endAdornment: "VND",
                                        sx: { "& .MuiInputBase-root": { fontSize: { xs: "0.875rem", sm: "1rem" } } },
                                    },
                                }}
                                required
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                            <FormItem
                                render="text-input"
                                name="batchNumber"
                                label={t(i18n.translationKey.batchNumber)}
                                placeholder={t(i18n.translationKey.batchNumber)}
                                required
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <FormItem
                                render="text-input"
                                name="note"
                                label={t(i18n.translationKey.note)}
                                placeholder={t(i18n.translationKey.note)}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <FormItem
                                render="date-picker"
                                name="expiryDate"
                                minDate={new Date()}
                                label={t(i18n.translationKey.expiryDate)}
                                placeholder={t(i18n.translationKey.expiryDate)}
                                required
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <FormItem
                                render="text-input"
                                name="sgk_CPNK"
                                label={t(i18n.translationKey.sgkCpnk)}
                                placeholder={t(i18n.translationKey.sgkCpnk)}
                                required
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <FormItem
                                render="autocomplete"
                                name="manufacturerId"
                                label={t(i18n.translationKey.manufacturer)}
                                placeholder={t(i18n.translationKey.manufacturer)}
                                options={toBaseOption<Manufacture>(manufacturers, {
                                    label: "manufacturerName",
                                    value: "id",
                                })}
                                onChange={handleSelectedManufacture}
                                required
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <FormItem
                                render="autocomplete"
                                name="countryId"
                                label={t(i18n.translationKey.countryOfOrigin)}
                                placeholder={t(i18n.translationKey.countryOfOrigin)}
                                options={toBaseOption<ManufactureCountry>(countries, {
                                    label: "countryName",
                                    value: "id",
                                })}
                                onChange={handleSelectedManufactureCountry}
                                required
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                            <FormItem
                                render="switch"
                                name="isFree"
                                label={t(i18n.translationKey.noCharge)}
                                placeholder={t(i18n.translationKey.noCharge)}
                                disabled={disabled}
                            />
                        </Grid>
                    </Grid>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="end"
                        spacing={{ xs: 1, sm: 2 }}
                        sx={{ mt: 2 }}
                    >
                        <ActionButton
                            label={t(i18n.translationKey.addNew)}
                            startIcon={<Done />}
                            size="small"
                            variant="contained"
                            onClick={pharmaceuticalInformationForm.handleSubmit(handleSubmitPharmaceuticalInformation)}
                            sx={{ borderRadius: 4, px: { xs: 1, sm: 2 } }}
                            disabled={disabled}
                        />
                        <ActionButton
                            label={t(i18n.translationKey.delete)}
                            startIcon={<DoNotDisturb />}
                            size="small"
                            disabled={
                                disabled ||
                                (pharmaceuticalInformationAgGrid.gridApi &&
                                    pharmaceuticalInformationAgGrid.gridApi.getSelectedRows().length === 0)
                            }
                            onClick={handleRemovePharmaceuticalInformation}
                            sx={{
                                borderRadius: 4,
                                px: { xs: 1, sm: 2 },
                                borderColor: "grey.400",
                                color: "grey.600",
                            }}
                        />
                    </Stack>
                </Box>

                <Box className="mt-2">
                    <AgDataGrid
                        columnDefs={columnDefs}
                        rowData={details}
                        onRowSelected={handleSelectedPharmaceuticalInformation}
                        suppressCellFocus={disabled}
                        {...pharmaceuticalInformationAgGrid}
                    />
                </Box>
            </Box>
        </DynamicForm>
    );
};

export default ImportPharmaceuticalInformation;
