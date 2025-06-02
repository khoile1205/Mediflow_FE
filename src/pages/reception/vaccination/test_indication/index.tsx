import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";

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
            { field: "requestId", headerName: "Số phiếu yêu cầu" },
            { field: "serviceCode", headerName: "Mã dịch vụ" },
            { field: "serviceName", headerName: "Tên dịch vụ" },
            { field: "quantity", headerName: "Số lượng", cellClass: "ag-cell-center" },
            {
                field: "unitPrice",
                headerName: "Đơn giá",
                cellClass: "ag-cell-center",
                valueFormatter: (params) => params.value.toLocaleString("vi-VN") + "₫",
            },
            {
                headerName: "Thành tiền",
                cellClass: "ag-cell-center",
                valueGetter: (params) => params.data.quantity * params.data.unitPrice,
                valueFormatter: (params) => params.value.toLocaleString("vi-VN") + "₫",
            },
            { field: "invoiceDate", headerName: "Ngày hóa đơn" },
            { field: "payment", headerName: "Thanh toán" },
        ],
        [],
    );

    return (
        <DynamicForm form={form}>
            <Stack spacing={2} direction="column" className="pt-3">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        Chỉ định xét nghiệm
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "primary.main", borderRadius: 2 }}>
                        <Grid container spacing={2.5}>
                            <Grid size={12}>
                                <FormItem
                                    render="select"
                                    label="Chỉ định theo nhóm bệnh"
                                    name="diseaseGroup"
                                    placeholder="Chọn nhóm bệnh"
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
                                />
                            </Grid>

                            <Grid size={8}>
                                <FormItem
                                    render="select"
                                    label="Chỉ định xét nghiệm"
                                    name="testService"
                                    placeholder="Chọn dịch vụ xét nghiệm"
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
                                />
                            </Grid>

                            <Grid size={4}>
                                <FormItem
                                    render="select"
                                    label="Phòng ban"
                                    name="department"
                                    placeholder="Chọn phòng ban"
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
                                />
                            </Grid>

                            <Grid size={12}>
                                <FormItem
                                    render="select"
                                    label="Nhóm dịch vụ"
                                    name="serviceGroup"
                                    placeholder="Chọn nhóm dịch vụ"
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Stack direction="row" spacing={2}>
                                    <ActionButton
                                        label="Thêm theo nhóm"
                                        startIcon={<AddCircle />}
                                        disabled={disabled}
                                    />
                                    <ActionButton label="Thêm dịch vụ" startIcon={<AddCircle />} disabled={disabled} />
                                    <ActionButton
                                        label="Xóa"
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
                        Danh sách chỉ định xét nghiệm
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
