import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import i18n from "~/configs/i18n";

interface TableRowData {
    key: string;
    requestId: string;
    serviceCode: string;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    invoiceDate: string;
    payment: string;
}

interface TestIndicationProps {
    disabled?: boolean;
}

export const TestIndication: React.FC<TestIndicationProps> = ({ disabled }) => {
    const { t } = useTranslation();
    const form = useForm();
    const agGrid = useAgGrid<TableRowData>({ rowSelection: "multiple" });

    const columnDefs: ColDef<TableRowData>[] = React.useMemo(
        () => [
            {
                checkboxSelection: true,
                headerCheckboxSelection: true,
                width: 50,
                pinned: true,
                resizable: false,
            },
            { field: "requestId", headerName: t(i18n.translationKey.requestNumber) },
            { field: "serviceCode", headerName: t(i18n.translationKey.serviceCode) },
            { field: "serviceName", headerName: t(i18n.translationKey.serviceName) },
            { field: "quantity", headerName: t(i18n.translationKey.quantity), cellClass: "ag-cell-center" },
            {
                field: "unitPrice",
                headerName: t(i18n.translationKey.unitPrice),
                cellClass: "ag-cell-center",
                valueFormatter: (params) => params.value.toLocaleString("vi-VN") + "₫",
            },
            {
                headerName: t(i18n.translationKey.totalAmount),
                cellClass: "ag-cell-center",
                valueGetter: (params) => params.data.quantity * params.data.unitPrice,
                valueFormatter: (params) => params.value.toLocaleString("vi-VN") + "₫",
            },
            { field: "invoiceDate", headerName: t(i18n.translationKey.invoiceDate) },
            { field: "payment", headerName: t(i18n.translationKey.payment) },
        ],
        [],
    );

    return (
        <DynamicForm form={form}>
            <Stack spacing={2} direction="column" className="pt-3">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        {t(i18n.translationKey.examinationIndication)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "primary.main", borderRadius: 2 }}>
                        <Grid container spacing={2.5}>
                            <Grid size={12}>
                                <FormItem
                                    render="select"
                                    label={t(i18n.translationKey.orderByDiseaseGroup)}
                                    name="diseaseGroup"
                                    placeholder={t(i18n.translationKey.selectDiseaseGroup)}
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
                                />
                            </Grid>

                            <Grid size={8}>
                                <FormItem
                                    render="select"
                                    label={t(i18n.translationKey.examinationIndication)}
                                    name="testService"
                                    placeholder={t(i18n.translationKey.selectExaminationService)}
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
                                />
                            </Grid>

                            <Grid size={4}>
                                <FormItem
                                    render="select"
                                    label={t(i18n.translationKey.department)}
                                    placeholder={t(i18n.translationKey.selectDepartment)}
                                    name="department"
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
                                />
                            </Grid>

                            <Grid size={12}>
                                <FormItem
                                    render="select"
                                    name="serviceGroup"
                                    label={t(i18n.translationKey.serviceGroup)}
                                    placeholder={t(i18n.translationKey.selectServiceGroup)}
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Stack direction="row" spacing={2}>
                                    <ActionButton
                                        label={t(i18n.translationKey.addByGroup)}
                                        startIcon={<AddCircle />}
                                        disabled={disabled}
                                    />
                                    <ActionButton
                                        label={t(i18n.translationKey.addHospitalService)}
                                        startIcon={<AddCircle />}
                                        disabled={disabled}
                                    />
                                    <ActionButton
                                        label={t(i18n.translationKey.delete)}
                                        startIcon={<Delete />}
                                        color="error"
                                        disabled={disabled}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        {t(i18n.translationKey.examinationIndicationList)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "primary.main", borderRadius: 2 }}>
                        <AgDataGrid
                            columnDefs={columnDefs}
                            rowData={[]}
                            {...agGrid}
                            gridOptions={{
                                ...agGrid.gridOptions,
                                pinnedBottomRowData: [],
                            }}
                        />
                    </Box>
                </Box>
            </Stack>
        </DynamicForm>
    );
};

export default TestIndication;
