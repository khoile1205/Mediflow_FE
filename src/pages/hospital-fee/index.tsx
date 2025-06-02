import { AddCircle, Edit } from "@mui/icons-material";
import { Box, Button, Grid, Stack, TextField, TextFieldProps, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import SearchBox from "~/components/common/search-box";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
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
    const hospitalFeeForm = useForm();

    const unpaidPatientAgGrid = useAgGrid({});
    const unpaidPatientColumnDefs = React.useMemo(() => {
        return [
            { field: "patientId", headerName: "Mã y tế" },
            { field: "patientName", headerName: "Tên bệnh nhân" },
            { field: "patientDOB", headerName: "Năm sinh" },
        ];
    }, []);

    const attachedServiceFeeAgGrid = useAgGrid({});
    const attachedServiceColumnDefs: ColDef<AttachedServiceFee>[] = React.useMemo(
        () => [
            {
                field: "content",
                headerName: "Nội dung",
            },
            {
                field: "quantity",
                headerName: "Số lượng",
                cellClass: "ag-cell-center",
            },
            {
                field: "beforeDiscount",
                headerName: "Thành tiền trước chiết khấu",
                cellClass: "ag-cell-center",
            },
            {
                field: "support",
                headerName: "Số tiền trợ",
                cellClass: "ag-cell-center",
            },

            {
                field: "cost",
                headerName: "Thành tiền sau chiết khấu",
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
                headerName: "Nội dung",
            },
            {
                field: "quantity",
                headerName: "Số lượng",
                cellClass: "ag-cell-center",
            },
            {
                field: "beforeDiscount",
                headerName: "Thành tiền trước chiết khấu",
                cellClass: "ag-cell-center",
            },
            {
                field: "support",
                headerName: "Số tiền trợ",
                cellClass: "ag-cell-center",
            },

            {
                field: "cost",
                headerName: "Thành tiền sau chiết khấu",
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
                    <ActionButton label="Thanh toán" startIcon={<AddCircle />} />
                    <ActionButton label="In hóa đơn" startIcon={<Edit />} />
                    <ActionButton label="Xóa chỉ định thanh toán" />
                </Stack>
                <Box className="mt-3 flex bg-[#F6F8D5] p-3">
                    <Box className="me-3 basis-1/4">
                        <Button fullWidth className="rounded-2xl" size="large" variant="contained">
                            Làm mới danh sách
                        </Button>
                        <SearchBox onChange={handleSearch} className="mt-6" />
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
                                <ReadonlyTextField label="Mã y tế" placeholder="CDCDN250000013" />
                                <ReadonlyTextField label="Số hoá đơn" />
                                <ReadonlyTextField
                                    label="Giá trị hoá đơn"
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
                                    label="Hình thức thanh toán"
                                    options={[
                                        {
                                            label: "Thanh toán bằng tiền mặt",
                                            value: "cash",
                                        },
                                        {
                                            label: "Thanh toán bằng thẻ ATM",
                                            value: "atm",
                                        },
                                        {
                                            label: "Thanh toán bằng chuyển khoản",
                                            value: "transfer",
                                        },
                                    ]}
                                />
                                <Box className="px-3">
                                    <Stack direction="row" className="mt-2 justify-between">
                                        <FormItem render="checkbox" name="isPaid" label="Phiếu thu" />
                                        <FormItem render="checkbox" name="isRefund" label="Hoàn trả" />
                                    </Stack>
                                    <FormItem render="checkbox" name="isCancel" label="Huỷ hoá đơn" />
                                </Box>
                            </Stack>
                            <Box className="me-2 flex-1">
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Grid container spacing={2}>
                                            <Grid size={4}>
                                                <ReadonlyTextField label="Họ và tên" placeholder="NGUYỄN VĂN A" />
                                            </Grid>
                                            <Grid size={2}>
                                                <ReadonlyTextField label="Tuổi" />
                                            </Grid>
                                            <Grid size={2}>
                                                <ReadonlyTextField label="Năm sinh" placeholder="2007" />
                                            </Grid>
                                            <Grid size={4}>
                                                <ReadonlyTextField label="Số hoá đơn" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
                                        <ReadonlyTextField multiline rows={4} label="Địa chỉ" />
                                    </Grid>
                                    <Grid size={12}>
                                        <Grid container spacing={2}>
                                            <Grid size={6}>
                                                <ReadonlyTextField label="Mã số thuế" />
                                            </Grid>
                                            <Grid size={6}>
                                                <ReadonlyTextField label="Mã ATM" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
                                        <ReadonlyTextField multiline rows={4} label="Tên đơn vị" />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                        <Box className="mt-4 flex">
                            <Box className="me-5 flex items-center">
                                <Typography className="mr-2 font-bold">Trạng thái HDDT:</Typography>
                                <Typography className="font-bold">_ _</Typography>
                            </Box>
                            <Box className="flex items-center">
                                <Typography className="mr-2 font-bold">Số HDDT:</Typography>
                                <Typography className="font-bold">_ _</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DynamicForm>
            <Stack className="mt-4" direction="column" spacing={3}>
                <Box>
                    <Typography className="mb-2 ms-3 font-bold">Dịch vụ thanh toán</Typography>
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
                    <Typography className="mb-2 ms-3 font-bold">Dịch vụ đính kèm</Typography>
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
