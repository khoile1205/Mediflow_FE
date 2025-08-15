import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ColDef } from "ag-grid-community";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import AgDataGrid from "~/components/common/ag-grid/ag-grid";
import { useAgGrid } from "~/components/common/ag-grid/hooks";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import useDebounce from "~/hooks/use-debounce";
import usePagination from "~/hooks/use-pagination";
import { inventoryApis } from "~/services/inventory/infras/inventory.api";
import { MedicineQuantityStatisticDto, PaginationResponse } from "~/services/inventory/infras/types";

interface SearchFormValues {
    searchTerm: string;
}

export default function MedicineQuantityStatisticsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const form = useForm<SearchFormValues>({ defaultValues: { searchTerm: "" } });
    const { pageIndex, pageSize, handlePageChange } = usePagination();

    const { onGridReady } = useAgGrid({ rowSelection: "single" });

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const sub = form.watch((v) => setSearchTerm(v.searchTerm ?? ""));
        return () => sub.unsubscribe();
    }, [form]);

    const { data, isFetching, refetch } = useQuery<PaginationResponse<MedicineQuantityStatisticDto>>({
        queryKey: [
            QueryKey.INVENTORY.GET_MEDICINE_QUANTITY_STATISTICS_WITH_PAGINATION,
            pageIndex,
            pageSize,
            debouncedSearchTerm,
        ],
        queryFn: async () => {
            const res = await inventoryApis.medicineQuantityStatistics.getList({
                pageIndex,
                pageSize,
                searchTerm: debouncedSearchTerm,
            });
            return res.Data;
        },
        enabled: true,
        placeholderData: (prev) => prev,
    });

    useEffect(() => {
        refetch();
    }, [pageIndex, pageSize, debouncedSearchTerm, refetch]);

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
            {
                headerName: t(i18n.translationKey.medicineCode),
                field: "medicineCode",
                flex: 1,
                sortable: true,
                minWidth: 100,
                valueGetter: (p) => p.data?.medicineCode ?? "N/A",
            },
            {
                headerName: t(i18n.translationKey.medicineName),
                field: "medicineName",
                flex: 2,
                sortable: true,
                minWidth: 150,
                maxWidth: 300,
                valueGetter: (p) => p.data?.medicineName ?? "N/A",
            },
            {
                headerName: t(i18n.translationKey.unit),
                field: "unit",
                flex: 1,
                sortable: true,
                minWidth: 100,
                valueGetter: (p) => p.data?.unit ?? "N/A",
            },
            {
                headerName: t(i18n.translationKey.numberOfBatches),
                field: "numberOfBatches",
                flex: 1,
                sortable: true,
                minWidth: 100,
                valueGetter: (p) => p.data?.numberOfBatches ?? 0,
            },
            {
                headerName: t(i18n.translationKey.totalQuantity),
                field: "totalQuantity",
                flex: 1,
                sortable: true,
                minWidth: 100,
                valueGetter: (p) => p.data?.totalQuantity ?? 0,
            },
            {
                headerName: t(i18n.translationKey.batchDetails),
                field: "_view",
                flex: 1,
                sortable: false,
                minWidth: 120,
                valueGetter: () => t(i18n.translationKey.viewDetail),
                cellClass: "text-link",
                cellStyle: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "#1976d2",
                    cursor: "pointer",
                },
                onCellClicked: (p) => {
                    const id = p.data?.medicineId;
                    if (id) navigate(`/inventory/medicine-quantity-statistics/medicines/${id}/medicine-batches`);
                },
            },
        ],
        [t, navigate],
    );

    return (
        <Box sx={{ padding: 1 }}>
            <Box sx={{ marginTop: 2 }}>
                <DynamicForm form={form}>
                    <FormItem
                        render="text-input"
                        name="searchTerm"
                        label={t(i18n.translationKey.searchTerm)}
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
                />
            </Box>
        </Box>
    );
}
