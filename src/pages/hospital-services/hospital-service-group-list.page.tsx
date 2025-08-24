import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ActionButton } from "~/components/common/action-button";
import AgDataGrid from "~/components/common/ag-grid/ag-grid";
import { useAgGrid } from "~/components/common/ag-grid/hooks";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import useDebounce from "~/hooks/use-debounce";
import usePagination from "~/hooks/use-pagination";
import { useMutationDeleteHospitalServiceGroup } from "~/services/hospital-service/hooks/mutations/use-mutation-delete-hospital-service-group";
import { useQueryGetHospitalServiceGroupList } from "~/services/hospital-service/hooks/queries/use-query-get-hospital-service-group-list";
import { useQueryServicesByGroupId } from "~/services/hospital-service/hooks/queries/use-query-services-by-group-id";
import { showToast } from "~/utils";
import { HospitalServiceGroup } from "./types";
import { usePasswordConfirm } from "~/contexts/password-confirmation.context";

interface SearchFormValues {
    serviceGroupId: number | null;
}

export default function HospitalServiceGroupPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { requestPasswordConfirmation } = usePasswordConfirm(); // Use the context hook

    const [selectedRow, setSelectedRow] = useState<HospitalServiceGroup | null>(null);
    const [, setIsEditOpen] = useState(false);

    const searchForm = useForm<SearchFormValues>({ defaultValues: { serviceGroupId: null } });
    const [groupName, setGroupName] = useState("");
    const debouncedGroupName = useDebounce(groupName, 500);

    const { handlePageChange, pageIndex, pageSize, resetPagination } = usePagination();

    const { data: response, refetch } = useQueryGetHospitalServiceGroupList({
        pageIndex,
        pageSize,
        searchTerm: debouncedGroupName,
    });

    const deleteGroup = useMutationDeleteHospitalServiceGroup();

    const { onGridReady } = useAgGrid({});

    const groupColumns = useMemo(
        () => [
            { headerName: t(i18n.translationKey.serviceGroupCode), field: "id", flex: 1 },
            { headerName: t(i18n.translationKey.serviceGroupName), field: "groupName", flex: 2 },
        ],
        [t],
    );

    const serviceColumns = useMemo(
        () => [
            { headerName: t(i18n.translationKey.serviceCode), field: "serviceCode", flex: 1 },
            { headerName: t(i18n.translationKey.serviceName), field: "serviceName", flex: 2 },
            {
                headerName: t(i18n.translationKey.unitPrice),
                field: "unitPrice",
                flex: 1,
                valueFormatter: ({ value }: { value: number }) => value?.toLocaleString("vi-VN") + " VND",
            },
        ],
        [t],
    );

    const handleAdd = () => {
        setSelectedRow(null);
        setIsEditOpen(true);
    };

    const handleEdit = () => {
        if (selectedRow) setIsEditOpen(true);
    };

    const handleDelete = () => {
        if (!selectedRow) return;
        requestPasswordConfirmation(() => {
            // This runs after password confirmation
            deleteGroup.mutate(selectedRow.id, {
                onSuccess: () => {
                    showToast.success(t(i18n.translationKey.deleteHospitalServiceGroupSuccess));
                    refetch();
                    queryClient.invalidateQueries({ queryKey: ["hospitalServiceGroups"] });
                    setSelectedRow(null);
                    searchForm.setValue("serviceGroupId", null);
                },
                onError: () => {
                    showToast.error(t(i18n.translationKey.deleteHospitalServiceGroupFailed));
                },
            });
        });
    };

    const handleSelectedServiceGroup = (e: any) => {
        if (e?.data) {
            setSelectedRow(e.data);
            searchForm.setValue("serviceGroupId", e.data.id);
        }
    };

    const selectedGroupId = searchForm.watch("serviceGroupId") ?? null;
    const { data: serviceData, isLoading: isLoadingServices } = useQueryServicesByGroupId(selectedGroupId);

    return (
        <Box p={3}>
            <DynamicForm form={searchForm}>
                <Grid container spacing={2} className="px-4 py-5" alignItems="center" justifyContent="flex-start">
                    <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ pt: "14px" }}>
                        <FormItem
                            render="data-grid"
                            name="serviceGroupId"
                            label={t(i18n.translationKey.selectServiceGroup)}
                            placeholder={t(i18n.translationKey.selectServiceGroup)}
                            onRowSelected={handleSelectedServiceGroup}
                            columnDefs={groupColumns}
                            rowData={response?.data ?? []}
                            displayField="groupName"
                            valueField="id"
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            totalItems={response?.totalItems ?? 0}
                            onPageChange={handlePageChange}
                            pagination
                            onSearch={(value) => {
                                setGroupName(value);
                                resetPagination();
                            }}
                            key={JSON.stringify(response?.data)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.add)}
                            startIcon={<AddCircle />}
                            size="small"
                            variant="outlined"
                            onClick={handleAdd}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.edit)}
                            startIcon={<Edit />}
                            size="small"
                            variant="outlined"
                            onClick={handleEdit}
                            disabled={!selectedRow}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.delete)}
                            startIcon={<Delete />}
                            size="small"
                            variant="outlined"
                            onClick={handleDelete}
                            disabled={!selectedRow}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                </Grid>
            </DynamicForm>

            <Box mt={4}>
                <AgDataGrid
                    rowData={serviceData?.services ?? []}
                    columnDefs={serviceColumns}
                    loading={isLoadingServices}
                    onGridReady={onGridReady}
                />
            </Box>
        </Box>
    );
}
