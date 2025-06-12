import { AddCircle, Edit } from "@mui/icons-material";
import { Box, Button, Grid, Stack, TextField, TextFieldProps, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { AttachedServiceFee, HospitalFee } from "~/entities/hospital-fee";

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

const HospitalFeePage: React.FC = () => {
    const { t } = useTranslation();
    const hospitalFeeForm = useForm();

    const unpaidPatientAgGrid = useAgGrid({});
    const unpaidPatientColumnDefs = React.useMemo(() => {
        return [
            { field: "patientId", headerName: t(i18n.translationKey.medicalCode) },
            { field: "patientName", headerName: t(i18n.translationKey.patientName) },
            { field: "patientDOB", headerName: t(i18n.translationKey.yearOfBirth) },
        ];
    }, []);

    const attachedServiceFeeAgGrid = useAgGrid({});
    const attachedServiceColumnDefs: ColDef<AttachedServiceFee>[] = React.useMemo(
        () => [
            {
                field: "content",
                headerName: t(i18n.translationKey.content),
            },
            {
                field: "quantity",
                headerName: t(i18n.translationKey.quantity),
                cellClass: "ag-cell-center",
            },
            {
                field: "beforeDiscount",
                headerName: t(i18n.translationKey.amountBeforeDiscount),
                cellClass: "ag-cell-center",
            },
            {
                field: "support",
                headerName: t(i18n.translationKey.discountAmount),
                cellClass: "ag-cell-center",
            },

            {
                field: "cost",
                headerName: t(i18n.translationKey.amountAfterDiscount),
                cellClass: "ag-cell-center",
            },
        ],
        [],
    );

    const hospitalServiceFeeAgGrid = useAgGrid({ rowSelection: "multiple" });
    const hospitalFeeColumnDefs: ColDef<HospitalFee>[] = React.useMemo(
        () => [
            {
                checkboxSelection: true,
                headerCheckboxSelection: true,
                width: 20,
                pinned: true,
                resizable: false,
            },
            {
                field: "content",
                headerName: t(i18n.translationKey.content),
            },
            {
                field: "quantity",
                headerName: t(i18n.translationKey.quantity),
                cellClass: "ag-cell-center",
            },
            {
                field: "beforeDiscount",
                headerName: t(i18n.translationKey.amountBeforeDiscount),
                cellClass: "ag-cell-center",
            },
            {
                field: "support",
                headerName: t(i18n.translationKey.discountAmount),
                cellClass: "ag-cell-center",
            },

            {
                field: "cost",
                headerName: t(i18n.translationKey.amountAfterDiscount),
                cellClass: "ag-cell-center",
            },
        ],
        [],
    );

    const onHospitalServiceSelectionChanged = () => {
        // TODO: implement logic select rows
    };

    const handleSearch = (value: string) => {
        console.log("Search value:", value);
        // TODO: Implement search logic here
    };

    return (
        <Box>
            <DynamicForm form={hospitalFeeForm}>
                <Stack spacing={1} direction="row" width="100%" className="px-4 py-5">
                    <ActionButton label={t(i18n.translationKey.payment)} startIcon={<AddCircle />} />
                    <ActionButton label={t(i18n.translationKey.printInvoice)} startIcon={<Edit />} />
                    <ActionButton label={t(i18n.translationKey.deletePaymentOrder)} />
                </Stack>
                <Box className="mt-3 flex bg-[#F6F8D5] p-3">
                    <Box className="me-3 basis-1/4">
                        <Button fullWidth className="rounded-2xl" size="large" variant="contained">
                            {t(i18n.translationKey.refreshList)}
                        </Button>
                        <SearchBox
                            onChange={handleSearch}
                            className="mt-6"
                            placeholder={t(i18n.translationKey.enterMedicalCode)}
                        />
                        <AgDataGrid
                            className="mt-3"
                            columnDefs={unpaidPatientColumnDefs}
                            rowData={[]}
                            {...unpaidPatientAgGrid}
                        />
                    </Box>
                    <Box className="flex-1">
                        <Box className="flex">
                            <Stack className="me-2 basis-1/4" direction="column" spacing={2}>
                                <ReadonlyTextField
                                    label={t(i18n.translationKey.medicalCode)}
                                    placeholder="CDCDN250000013"
                                />
                                <ReadonlyTextField label={t(i18n.translationKey.invoiceNumber)} />
                                <ReadonlyTextField
                                    label={t(i18n.translationKey.invoiceValue)}
                                    slotProps={{
                                        input: {
                                            endAdornment: "VND",
                                            readOnly: true,
                                        },
                                    }}
                                />
                                <FormItem
                                    render="select"
                                    name="paidType"
                                    label={t(i18n.translationKey.paymentMethod)}
                                    options={[
                                        {
                                            label: t(i18n.translationKey.payByCash),
                                            value: "cash",
                                        },
                                        {
                                            label: t(i18n.translationKey.payByAtm),
                                            value: "atm",
                                        },
                                        {
                                            label: t(i18n.translationKey.payByTransfer),
                                            value: "transfer",
                                        },
                                    ]}
                                />
                                <Box className="px-3">
                                    <Stack direction="row" className="mt-2 justify-between">
                                        <FormItem
                                            render="checkbox"
                                            name="isPaid"
                                            label={t(i18n.translationKey.receipt)}
                                        />
                                        <FormItem
                                            render="checkbox"
                                            name="isRefund"
                                            label={t(i18n.translationKey.refund)}
                                        />
                                    </Stack>
                                    <FormItem
                                        render="checkbox"
                                        name="isCancel"
                                        label={t(i18n.translationKey.cancelInvoice)}
                                    />
                                </Box>
                            </Stack>
                            <Box className="me-2 flex-1">
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Grid container spacing={2}>
                                            <Grid size={4}>
                                                <ReadonlyTextField
                                                    label={t(i18n.translationKey.fullName)}
                                                    placeholder="NGUYỄN VĂN A"
                                                />
                                            </Grid>
                                            <Grid size={2}>
                                                <ReadonlyTextField label={t(i18n.translationKey.age)} />
                                            </Grid>
                                            <Grid size={2}>
                                                <ReadonlyTextField
                                                    label={t(i18n.translationKey.yearOfBirth)}
                                                    placeholder="2007"
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <ReadonlyTextField label={t(i18n.translationKey.invoiceNumber)} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
                                        <ReadonlyTextField multiline rows={4} label={t(i18n.translationKey.address)} />
                                    </Grid>
                                    <Grid size={12}>
                                        <Grid container spacing={2}>
                                            <Grid size={6}>
                                                <ReadonlyTextField label={t(i18n.translationKey.taxCode)} />
                                            </Grid>
                                            <Grid size={6}>
                                                <ReadonlyTextField label={t(i18n.translationKey.atmCode)} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
                                        <ReadonlyTextField multiline rows={4} label={t(i18n.translationKey.unitName)} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                        <Box className="mt-4 flex">
                            <Box className="me-5 flex items-center">
                                <Typography className="mr-2 font-bold">
                                    {t(i18n.translationKey.einvoiceStatus)}:
                                </Typography>
                                <Typography className="font-bold">_ _</Typography>
                            </Box>
                            <Box className="flex items-center">
                                <Typography className="mr-2 font-bold">
                                    {t(i18n.translationKey.einvoiceNumber)}:
                                </Typography>
                                <Typography className="font-bold">_ _</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DynamicForm>
            <Stack className="mt-4" direction="column" spacing={3}>
                <Box>
                    <Typography className="mb-2 ms-3 font-bold">{t(i18n.translationKey.hospitalService)}</Typography>
                    <AgDataGrid
                        columnDefs={hospitalFeeColumnDefs}
                        rowData={[]}
                        {...hospitalServiceFeeAgGrid}
                        gridOptions={{
                            ...hospitalServiceFeeAgGrid.gridOptions,
                            pinnedBottomRowData: [],
                            onSelectionChanged: onHospitalServiceSelectionChanged,
                        }}
                    />
                </Box>
                <Box>
                    <Typography className="mb-2 ms-3 font-bold">
                        {t(i18n.translationKey.medicalAttachedService)}
                    </Typography>
                    <AgDataGrid
                        columnDefs={attachedServiceColumnDefs}
                        rowData={[]}
                        {...attachedServiceFeeAgGrid}
                        gridOptions={{
                            ...attachedServiceFeeAgGrid.gridOptions,
                            pinnedBottomRowData: [],
                        }}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default HospitalFeePage;
