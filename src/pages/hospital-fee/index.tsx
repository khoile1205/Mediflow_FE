import { AddCircle, Print } from "@mui/icons-material";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ColDef, RowSelectedEvent } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { PaymentType, ReceiptPaymentType } from "~/constants/enums";
import { QueryKey } from "~/constants/query-key";
import { useMutationCreateReceiptPayment } from "~/services/hospital-fee/hooks/mutations";
import { useQueryGetUnpaidServiceByPatientId, useQueryUnpaidPatientList } from "~/services/hospital-fee/hooks/queries";
import { CreateReceiptPaymentRequest, HospitalServiceType, UnpaidPatientSummary } from "~/services/hospital-fee/infras";
import { useQueryGetAttachHospitalService } from "~/services/hospital-service/hooks/queries";
import { useQueryGetPatientById } from "~/services/patient/hooks/queries";
import { useQueryGetLatestReceptionIdByPatientId } from "~/services/reception/hooks/queries";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate, getCurrentAge } from "~/utils/date-time";
import { ReceiptPrinter } from "./receipt-printer";
import { HospitalFeeFormValue, HospitalServiceItem } from "./types";

const HospitalFeePage: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const receiptRef = React.useRef<HTMLDivElement>(null);

    const [patientId, setPatientId] = React.useState<number | null>(null);
    const [searchUnpaidPatientTerm, setSearchUnpaidPatientTerm] = React.useState("");
    // Queries
    const {
        data: { unpaidPatientList },
        refetch,
    } = useQueryUnpaidPatientList({
        searchTerm: searchUnpaidPatientTerm,
    });

    const { data: patientData } = useQueryGetPatientById({ patientId });
    const { data: receptionId } = useQueryGetLatestReceptionIdByPatientId(patientId);
    const {
        data: { patientPaymentList },
    } = useQueryGetUnpaidServiceByPatientId(patientId);

    // Mutations
    const { mutateAsync: createReceiptPayment } = useMutationCreateReceiptPayment();
    // AG Grid
    const unpaidPatientAgGrid = useAgGrid({});

    // const attachedServiceFeeAgGrid = useAgGrid({});
    const hospitalServiceFeeAgGrid = useAgGrid({ rowSelection: "multiple" });
    const attachedServiceFeeAgGrid = useAgGrid({});

    const {
        data: { attachHospitalServices },
    } = useQueryGetAttachHospitalService();

    // Form
    const hospitalFeeForm = useForm<HospitalFeeFormValue>({
        defaultValues: {
            patientCode: "",
            invoiceNumber: "",
            invoiceValue: 0,
            phoneNumber: "",
            paidType: PaymentType.CASH,
            isPaid: true,
            isRefund: false,
            isCancel: false,
            name: "",
            dob: "",
            age: 0,
            address: "",
            taxCode: "",
            atmCode: "",
            unitName: "",
            method: ReceiptPaymentType.PAID,
            note: "",
            hospitalServiceItems: [],
        },
    });

    const handleSelectedPatient = (selectedRows: RowSelectedEvent<UnpaidPatientSummary>) => {
        hospitalFeeForm.reset();

        const selectedPatient = selectedRows.api.getSelectedRows()[0];
        setPatientId(selectedPatient ? selectedPatient.id : null);
    };

    const handleSelectedHospitalService = (event: RowSelectedEvent<HospitalServiceItem>) => {
        const selectedServices = event.api.getSelectedRows();
        hospitalFeeForm.setValue("hospitalServiceItems", selectedServices);
    };

    const handleSearch = (value: string) => {
        setSearchUnpaidPatientTerm(value);
    };

    const handleSubmit = async (data: HospitalFeeFormValue) => {
        const payload = getCreateReceiptPaymentPayload(data);
        const invoiceNumber = await createReceiptPayment({ patientId: patientId!, payload });
        hospitalFeeForm.setValue("invoiceNumber", invoiceNumber);
    };

    const handleCancel = () => {
        hospitalFeeForm.reset();
        setPatientId(null);
        hospitalServiceFeeAgGrid.gridApi.deselectAll();
        unpaidPatientAgGrid.gridApi.deselectAll();
        queryClient.invalidateQueries({ queryKey: [QueryKey.HOSPITAL_FEE.GET_UNPAID_PATIENT_LIST] });
        queryClient.invalidateQueries({
            queryKey: [QueryKey.HOSPITAL_FEE.GET_UNPAID_SERVICE_BY_PATIENT_ID, patientId],
        });
    };

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
    });

    const getCreateReceiptPaymentPayload = (data: HospitalFeeFormValue): CreateReceiptPaymentRequest => {
        const serviceRequestIds = data.hospitalServiceItems
            .filter((service) => service.serviceType === HospitalServiceType.SERVICE)
            .map((service) => service.id);
        const attachedServiceIds = attachedHospitalServiceFee.map((service) => service.id);

        return {
            receptionId,
            method: data.method,
            note: data.note,
            receptionVaccinationIds: data.hospitalServiceItems
                .filter((service) => service.serviceType === HospitalServiceType.VACCINATION)
                .map((service) => service.id),
            serviceRequestDetailIds: [...serviceRequestIds, ...attachedServiceIds],
        };
    };

    React.useEffect(() => {
        if (patientData) {
            hospitalFeeForm.setValue("patientCode", patientData.code);
            hospitalFeeForm.setValue("name", patientData.name);
            hospitalFeeForm.setValue("dob", formatDate(patientData.dob, DATE_TIME_FORMAT["dd/MM/yyyy"]));
            hospitalFeeForm.setValue("age", getCurrentAge(patientData.dob));
            hospitalFeeForm.setValue("phoneNumber", patientData.phoneNumber);
            hospitalFeeForm.setValue(
                "address",
                `${patientData.addressDetail}, ${patientData.ward}, ${patientData.district}, ${patientData.province}`,
            );
        }
    }, [patientData]);

    const unpaidHospitalServiceFee = React.useMemo(() => {
        return patientPaymentList.filter((service) => {
            if (service.serviceType === HospitalServiceType.VACCINATION) {
                return true;
            }
            return !attachHospitalServices.some((attachService) => attachService.id === service.serviceId);
        });
    }, [attachHospitalServices, patientPaymentList]);

    const attachedHospitalServiceFee = React.useMemo(() => {
        const result = [];

        const examinationFee = patientPaymentList.find((service) => service.serviceName === "Công khám");
        if (examinationFee) {
            result.push(examinationFee);
        }

        const gridApi = hospitalServiceFeeAgGrid?.gridApi;
        if (!gridApi) return result;

        const selectedRows = gridApi.getSelectedRows?.() as HospitalServiceItem[];
        if (selectedRows.length === 0) return result;

        const allAttachedHospitalService = patientPaymentList.filter((service) =>
            attachHospitalServices.some((attachService) => attachService.id === service.serviceId),
        );

        const attachedService = allAttachedHospitalService.filter((service) => {
            return selectedRows.some((row) => row.requestNumber === service.requestNumber);
        });

        return [...result, ...attachedService].filter(Boolean);
    }, [hospitalServiceFeeAgGrid, attachHospitalServices, patientPaymentList]);

    const currentReceiptSummary = React.useMemo(() => {
        const selectedHospitalServices = hospitalFeeForm.watch("hospitalServiceItems") ?? [];

        const totalQuantity = selectedHospitalServices.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = selectedHospitalServices.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

        return {
            serviceName: t(i18n.translationKey.totalServiceFee),
            quantity: totalQuantity,
            amountBeforeDiscount: totalAmount,
            support: 0,
            cost: totalAmount,
        };
    }, [hospitalFeeForm.watch("hospitalServiceItems")]);

    return (
        <Box>
            <DynamicForm form={hospitalFeeForm}>
                <Stack spacing={1} direction="row" width="100%" className="px-4 py-5">
                    <ActionButton
                        label={t(i18n.translationKey.payment)}
                        startIcon={<AddCircle />}
                        onClick={hospitalFeeForm.handleSubmit(handleSubmit)}
                        disabled={
                            !patientId ||
                            patientPaymentList.length === 0 ||
                            (hospitalFeeForm.watch("hospitalServiceItems").length === 0 &&
                                attachedHospitalServiceFee.length === 0) ||
                            !!hospitalFeeForm.watch("invoiceNumber")
                        }
                    />
                    <ActionButton
                        label={t(i18n.translationKey.printInvoice)}
                        startIcon={<Print />}
                        onClick={handlePrint}
                        disabled={!patientId || !hospitalFeeForm.watch("invoiceNumber")}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.cancel)}
                        disabled={!patientId || patientPaymentList.length === 0}
                        onClick={handleCancel}
                    />
                </Stack>
                <Box className="mt-3 flex bg-[#F6F8D5] p-3">
                    <Box className="xl:basis-3/10 me-3 md:basis-1/4">
                        <Button
                            fullWidth
                            className="rounded-2xl"
                            size="large"
                            variant="contained"
                            onClick={() => refetch()}
                        >
                            {t(i18n.translationKey.refreshList)}
                        </Button>
                        <SearchBox
                            onChange={handleSearch}
                            className="mt-6"
                            placeholder={t(i18n.translationKey.enterMedicalCode)}
                        />
                        <AgDataGrid
                            className="mt-3"
                            columnDefs={[
                                { field: "code", headerName: t(i18n.translationKey.medicalCode), flex: 1 },
                                { field: "name", headerName: t(i18n.translationKey.patientName), flex: 1 },
                                {
                                    field: "dob",
                                    headerName: t(i18n.translationKey.yearOfBirth),
                                    valueFormatter: ({ value }) => formatDate(value, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                },
                            ]}
                            rowData={unpaidPatientList}
                            maxRows={7}
                            onRowSelected={handleSelectedPatient}
                            {...unpaidPatientAgGrid}
                        />
                    </Box>
                    <Box className="flex-1">
                        <Box className="flex">
                            <Stack className="me-2 basis-1/4" direction="column" spacing={2}>
                                <FormItem
                                    render="text-input"
                                    label={t(i18n.translationKey.medicalCode)}
                                    name="patientCode"
                                    placeholder="CDCDN250000013"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                                <FormItem
                                    render="text-input"
                                    label={t(i18n.translationKey.invoiceNumber)}
                                    name="invoiceNumber"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                                <FormItem
                                    render="text-input"
                                    name="invoiceValue"
                                    label={t(i18n.translationKey.invoiceValue)}
                                    value={formatCurrencyVND(
                                        [
                                            ...hospitalFeeForm.watch("hospitalServiceItems"),
                                            ...attachedHospitalServiceFee,
                                        ].reduce((total, item) => total + item.unitPrice * item.quantity, 0),
                                    )}
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
                                            value: PaymentType.CASH,
                                        },
                                        {
                                            label: t(i18n.translationKey.payByAtm),
                                            value: PaymentType.ATM,
                                        },
                                        {
                                            label: t(i18n.translationKey.payByTransfer),
                                            value: PaymentType.TRANSFER,
                                        },
                                    ]}
                                />
                                <Box className="px-3">
                                    <Stack direction="row" className="mt-2 justify-between">
                                        <FormItem
                                            render="radio-group"
                                            name="method"
                                            options={[
                                                {
                                                    label: t(i18n.translationKey.receipt),
                                                    value: ReceiptPaymentType.PAID.toString(),
                                                },
                                                // {
                                                //     label: t(i18n.translationKey.refund),
                                                //     value: ReceiptPaymentType.REFUND,
                                                // },
                                                // {
                                                //     label: t(i18n.translationKey.cancelInvoice),
                                                //     value: "cancelInvoice",
                                                // },
                                            ]}
                                        />

                                        {/* <FormItem
                                            render="checkbox"
                                            name="isRefund"
                                            label={t(i18n.translationKey.refund)}
                                        /> */}
                                    </Stack>
                                </Box>
                            </Stack>
                            <Box className="me-2 flex-1">
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Grid container spacing={2}>
                                            <Grid size={4}>
                                                <FormItem
                                                    render="text-input"
                                                    name="name"
                                                    label={t(i18n.translationKey.fullName)}
                                                    placeholder="NGUYỄN VĂN A"
                                                    slotProps={{ input: { readOnly: true } }}
                                                />
                                            </Grid>
                                            <Grid size={3}>
                                                <FormItem
                                                    render="text-input"
                                                    name="dob"
                                                    label={t(i18n.translationKey.dateOfBirth)}
                                                    placeholder="11/11/1990"
                                                    slotProps={{ input: { readOnly: true } }}
                                                />
                                            </Grid>
                                            <Grid size={2}>
                                                <FormItem
                                                    render="text-input"
                                                    name="age"
                                                    label={t(i18n.translationKey.age)}
                                                    slotProps={{ input: { readOnly: true } }}
                                                />
                                            </Grid>
                                            <Grid size={3}>
                                                <FormItem
                                                    render="text-input"
                                                    name="phoneNumber"
                                                    label={t(i18n.translationKey.phoneNumber)}
                                                    slotProps={{ input: { readOnly: true } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
                                        <FormItem
                                            render="text-area"
                                            name="address"
                                            label={t(i18n.translationKey.address)}
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <Grid container spacing={2}>
                                            <Grid size={6}>
                                                <FormItem
                                                    render="text-input"
                                                    name="taxCode"
                                                    label={t(i18n.translationKey.taxCode)}
                                                    slotProps={{ input: { readOnly: true } }}
                                                />
                                            </Grid>
                                            <Grid size={6}>
                                                <FormItem
                                                    render="text-input"
                                                    name="atmCode"
                                                    label={t(i18n.translationKey.atmCode)}
                                                    slotProps={{ input: { readOnly: true } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
                                        <FormItem
                                            render="text-area"
                                            name="unitName"
                                            label={t(i18n.translationKey.unitName)}
                                            multiline
                                            rows={4}
                                            slotProps={{ input: { readOnly: true } }}
                                        />
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
                <Stack className="mt-4" direction="column" spacing={3}>
                    <Box>
                        <Typography className="mb-2 ms-3 font-bold">
                            {t(i18n.translationKey.hospitalService)}
                        </Typography>
                        <AgDataGrid
                            columnDefs={[
                                {
                                    checkboxSelection: true,
                                    headerCheckboxSelection: true,
                                    width: 50,
                                    pinned: true,
                                    resizable: false,
                                    flex: 1,
                                },
                                {
                                    field: "serviceName",
                                    headerName: t(i18n.translationKey.content),
                                    flex: 1.3,
                                },
                                {
                                    field: "quantity",
                                    headerName: t(i18n.translationKey.quantity),
                                    width: 100,
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                },
                                {
                                    field: "unitPrice",
                                    headerName: t(i18n.translationKey.unitPrice),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                    valueGetter: (params) =>
                                        params.data?.unitPrice ? formatCurrencyVND(params.data.unitPrice) : "",
                                },
                                {
                                    field: "amountBeforeDiscount",
                                    headerName: t(i18n.translationKey.amountBeforeDiscount),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                    valueGetter: (params) =>
                                        params.data?.amountBeforeDiscount !== undefined
                                            ? formatCurrencyVND(params.data.amountBeforeDiscount)
                                            : formatCurrencyVND(params.data.unitPrice * params.data.quantity),
                                },

                                {
                                    field: "support",
                                    headerName: t(i18n.translationKey.discountAmount),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                    valueGetter: () => formatCurrencyVND(0),
                                },

                                {
                                    field: "cost",
                                    headerName: t(i18n.translationKey.amountAfterDiscount),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                    valueGetter: (params) =>
                                        params.data?.cost !== undefined
                                            ? formatCurrencyVND(params.data.cost)
                                            : formatCurrencyVND(params.data.unitPrice * params.data.quantity),
                                },
                                {
                                    field: "createdAt",
                                    headerName: t(i18n.translationKey.invoiceDate),
                                    valueGetter: (params) => {
                                        if (!params.data.createdAt) return "";

                                        return formatDate(
                                            params.data.createdAt,
                                            DATE_TIME_FORMAT["dd/MM/yyyy HH:mm:ss"],
                                        );
                                    },
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                },
                            ]}
                            maxRows={5}
                            rowData={unpaidHospitalServiceFee}
                            onRowSelected={handleSelectedHospitalService}
                            pinnedBottomRowData={
                                hospitalFeeForm.watch("hospitalServiceItems").length > 0 ? [currentReceiptSummary] : []
                            }
                            {...hospitalServiceFeeAgGrid}
                        />
                    </Box>
                    <Box>
                        <Typography className="mb-2 ms-3 font-bold">
                            {t(i18n.translationKey.medicalAttachedService)}
                        </Typography>
                        <AgDataGrid
                            columnDefs={
                                [
                                    {
                                        field: "serviceName",
                                        headerName: t(i18n.translationKey.serviceName),
                                        flex: 1.3,
                                        cellClass: "ag-cell-center",
                                    },
                                    {
                                        field: "quantity",
                                        headerName: t(i18n.translationKey.quantity),
                                        width: 100,
                                        cellClass: "ag-cell-center",
                                        flex: 1,
                                    },
                                    {
                                        field: "unitPrice",
                                        headerName: t(i18n.translationKey.unitPrice),
                                        cellClass: "ag-cell-center",
                                        flex: 1,
                                        valueGetter: (params) =>
                                            params.data?.unitPrice ? formatCurrencyVND(params.data.unitPrice) : "",
                                    },
                                    {
                                        field: "support",
                                        headerName: t(i18n.translationKey.discountAmount),
                                        cellClass: "ag-cell-center",
                                        flex: 1,
                                        valueGetter: () => formatCurrencyVND(0),
                                    },

                                    {
                                        field: "unitPrice",
                                        headerName: t(i18n.translationKey.amountAfterDiscount),
                                        cellClass: "ag-cell-center",
                                        flex: 1,
                                        // valueGetter: (params) =>
                                        //     params.data?.cost !== undefined
                                        //         ? formatCurrencyVND(params.data.cost)
                                        //         : formatCurrencyVND(params.data.unitPrice * params.data.quantity),
                                    },
                                    {
                                        field: "createdAt",
                                        headerName: t(i18n.translationKey.invoiceDate),
                                        valueGetter: (params) => {
                                            if (!params.data.createdAt) return "";

                                            return formatDate(
                                                params.data.createdAt,
                                                DATE_TIME_FORMAT["dd/MM/yyyy HH:mm:ss"],
                                            );
                                        },
                                        cellClass: "ag-cell-center",
                                        flex: 1,
                                    },
                                ] as ColDef<HospitalServiceItem>[]
                            }
                            rowData={attachedHospitalServiceFee}
                            {...attachedServiceFeeAgGrid}
                            // pinnedBottomRowData={unpaidHospitalServiceFee}
                        />
                    </Box>
                </Stack>
            </DynamicForm>

            <Box style={{ display: "none" }}>
                <ReceiptPrinter ref={receiptRef} formValue={hospitalFeeForm.watch()} />
            </Box>
        </Box>
    );
};

export default HospitalFeePage;
