import { AddCircle, Delete, DoNotDisturb, Done } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Grid, IconButton, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";

interface TableRowData {
    type: string;
    name: string;
    quantity: number;
    dose: string;
    usage: string;
    usageDate: string;
    invoiceDate: string;
    appointmentDate: string;
    payment: string;
    confirmation: string;
    note: string;
}

export const VaccinationIndication: React.FC = () => {
    const form = useForm();
    const agGrid = useAgGrid<TableRowData>({ rowSelection: "multiple" });

    const columnDefs: ColDef<TableRowData>[] = [
        {
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: true,
            resizable: false,
        },
        { field: "type", headerName: "Loại vắc xin/huyết thanh" },
        { field: "name", headerName: "Tên vắc xin/huyết thanh" },
        { field: "quantity", headerName: "Số lượng", cellClass: "ag-cell-center" },
        { field: "dose", headerName: "Mũi thứ" },
        { field: "usage", headerName: "Cho sử dụng" },
        { field: "usageDate", headerName: "Ngày sử dụng" },
        { field: "invoiceDate", headerName: "Ngày hóa đơn" },
        { field: "appointmentDate", headerName: "Ngày hẹn" },
        { field: "payment", headerName: "Thanh toán" },
        { field: "confirmation", headerName: "Xác nhận tiêm chủng" },
        { field: "note", headerName: "Ghi chú" },
    ];

    return (
        <DynamicForm form={form}>
            <Stack spacing={2} className="pt-3">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        Chỉ định tiêm chủng
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                        <Grid container spacing={2.5} alignItems="flex-start">
                            <Grid size={3}>
                                <FormItem
                                    render="select"
                                    name="vaccine"
                                    label="Vắc xin"
                                    placeholder="Chọn vắc xin"
                                    options={[]}
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormItem
                                    render="input-number"
                                    name="quantity"
                                    label="Số lượng"
                                    placeholder="0"
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormItem
                                    render="select"
                                    name="dose"
                                    label="Mũi thứ"
                                    placeholder="Chọn mũi"
                                    options={[]}
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormItem
                                    render="date-picker"
                                    name="appointmentDate"
                                    label="Ngày hẹn"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormItem
                                    render="text-input"
                                    name="note"
                                    label="Ghi chú"
                                    placeholder="Ghi chú"
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true },
                                        endAdornment: <IconButton size="small">✕</IconButton>,
                                    }}
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
                                            label="Thêm mới"
                                            startIcon={<AddCircle />}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                                borderColor: "grey.400",
                                                color: "grey.600",
                                            }}
                                        />
                                        <ActionButton
                                            label="Xoá"
                                            startIcon={<Delete />}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                                borderColor: "grey.400",
                                                color: "grey.600",
                                            }}
                                        />
                                        <ActionButton
                                            label="Xoá các chỉ định đã chọn"
                                            startIcon={<Delete />}
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            sx={{ borderRadius: 4, px: 2 }}
                                        />
                                    </Stack>
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked sx={{ p: 0.5 }} />}
                                        label={<Typography fontWeight="bold">Sử dụng hôm nay</Typography>}
                                    />
                                    <Stack direction="row" spacing={1}>
                                        <ActionButton
                                            label="Đồng ý sử dụng"
                                            startIcon={<Done />}
                                            size="small"
                                            color="success"
                                            variant="contained"
                                            sx={{ borderRadius: 4, px: 2 }}
                                        />
                                        <ActionButton
                                            label="Không đồng ý sử dụng"
                                            startIcon={<DoNotDisturb />}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                                borderColor: "grey.400",
                                                color: "grey.600",
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        Danh sách chỉ định tiêm chủng
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "grey.300", borderRadius: 2 }}>
                        <AgDataGrid columnDefs={columnDefs} rowData={[]} {...agGrid} />
                    </Box>
                </Box>
            </Stack>
        </DynamicForm>
    );
};

export default VaccinationIndication;
