import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ColDef, RowClassParams } from "ag-grid-community";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import AgDataGrid from "~/components/common/ag-grid/ag-grid";
import { useAgGrid } from "~/components/common/ag-grid/hooks";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import useDebounce from "~/hooks/use-debounce";
import usePagination from "~/hooks/use-pagination";
import { inventoryApis } from "~/services/inventory/infras/inventory.api";
import { MedicineBatchForStatisticDto, PaginationResponse } from "~/services/inventory/infras/types";

interface SearchFormValues {
    batchNumber: string;
}

export default function MedicineBatchesByMedicineIdPage() {
    const { t } = useTranslation();
    const { medicineId } = useParams<{ medicineId: string }>();

    const form = useForm<SearchFormValues>({ defaultValues: { batchNumber: "" } });
    const { pageIndex, pageSize, handlePageChange } = usePagination();

    const { onGridReady } = useAgGrid({ rowSelection: "single" });

    const [batchNumber, setBatchNumber] = useState("");
    const debouncedBatchNumber = useDebounce(batchNumber, 500);

    useEffect(() => {
        const sub = form.watch((v) => setBatchNumber(v.batchNumber ?? ""));
        return () => sub.unsubscribe();
    }, [form]);

    const { data, isFetching, refetch } = useQuery<PaginationResponse<MedicineBatchForStatisticDto>>({
        queryKey: [
            QueryKey.INVENTORY.GET_MEDICINE_BATCHES_BY_MEDICINE_ID_WITH_PAGINATION,
            medicineId,
            pageIndex,
            pageSize,
            debouncedBatchNumber,
        ],
        queryFn: async () => {
            const res = await inventoryApis.medicineQuantityStatistics.getMedicineBatchesByMedicineId({
                medicineId: medicineId!,
                pageIndex,
                pageSize,
                batchNumber: debouncedBatchNumber,
            });
            return res.Data;
        },
        enabled: !!medicineId,
        placeholderData: (prev) => prev,
    });

    useEffect(() => {
        refetch();
    }, [pageIndex, pageSize, debouncedBatchNumber, refetch]);

    const rows = data?.data ?? [];
    const totalItems = data?.totalItems ?? 0;

    const columns = useMemo<ColDef[]>(
        () => [
            {
                headerName: t(i18n.translationKey.no),
                valueGetter: ({ node }) => (node ? (node.rowIndex ?? 0) + 1 : 1),
                width: 90,
                sortable: false,
            },
            { headerName: t(i18n.translationKey.medicineName), field: "medicineName", flex: 2, sortable: true },
            { headerName: t(i18n.translationKey.batchNumber), field: "batchNumber", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.importDate), field: "importDate", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.expiryDate), field: "expiryDate", flex: 1, sortable: true },
            {
                headerName: t(i18n.translationKey.importPrice),
                field: "importPrice",
                flex: 1,
                sortable: true,
                valueFormatter: ({ value }) => (value == null ? "" : `${Number(value).toLocaleString("vi-VN")} VNĐ`),
                cellClass: "text-link",
            },
            { headerName: t(i18n.translationKey.supplier), field: "supplierName", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.manufacturer), field: "manufacturerName", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.quantity), field: "quantity", flex: 1, sortable: true },
        ],
        [t],
    );

    const rowClassRules = useMemo(
        () => ({
            "expired-row": (params: RowClassParams<MedicineBatchForStatisticDto>) => {
                if (!params.data?.expiryDate) return false;
                const expiryDate = new Date(params.data.expiryDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return expiryDate <= today;
            },
        }),
        [],
    );

    return (
        <Box sx={{ padding: 1 }}>
            <style>
                {`
          .expired-row {
              background-color: #f0f0f0 !important;
              color: #9e9e9e !important;
          }
        `}
            </style>
            <Box sx={{ marginTop: 2 }}>
                <DynamicForm form={form}>
                    <FormItem
                        render="text-input"
                        name="batchNumber"
                        label={t(i18n.translationKey.batchNumber)}
                        placeholder={t(i18n.translationKey.search)}
                        sx={{ maxWidth: 400 }}
                    />
                </DynamicForm>
            </Box>

            {rows.length === 0 && !isFetching && (
                <Box sx={{ textAlign: "center", padding: 2 }}>{t(i18n.translationKey.noData)}</Box>
            )}
            <Box className="custom-ag-grid" sx={{ height: "600px", overflow: "auto" }}>
                <AgDataGrid
                    onGridReady={onGridReady}
                    columnDefs={columns}
                    rowData={rows}
                    rowSelection="single"
                    pagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    loading={isFetching}
                    domLayout="normal"
                    rowClassRules={rowClassRules}
                />
            </Box>
        </Box>
    );
}
