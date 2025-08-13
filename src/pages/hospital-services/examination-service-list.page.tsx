import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { RowClickedEvent } from "ag-grid-community";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import AgDataGrid from "~/components/common/ag-grid/ag-grid";
import { useAgGrid } from "~/components/common/ag-grid/hooks";
import Dialog from "~/components/common/dialog/dialog";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import i18n from "~/configs/i18n";
import useDebounce from "~/hooks/use-debounce";
import usePagination from "~/hooks/use-pagination";
import { useMutationCreateExaminationService } from "~/services/hospital-service/hooks/mutations/use-mutation-create-examination-service";
import { useMutationDeleteExaminationService } from "~/services/hospital-service/hooks/mutations/use-mutation-delete-examination-service";
import { useMutationUpdateExaminationService } from "~/services/hospital-service/hooks/mutations/use-mutation-update-examination-service";
import { useQueryExaminationService } from "~/services/hospital-service/hooks/queries/use-query-get-all-examination-service";
import { ExaminationService } from "~/services/hospital-service/infras/types";
import { showToast } from "~/utils";
import { ConfirmPasswordDialog } from "../management/medicine/ConfirmPasswordDialog";
import ModalEditExaminationService from "./ModalEditExaminationService";

interface ServiceTestParameter {
    serviceId: number;
    parameterName: string;
    unit: string;
    standardValue: string;
    equipmentName: string;
    specimenType: string;
    id: number;
    isSuspended: boolean;
    isCancelled: boolean;
    createdAt: string;
    createdBy: number;
    lastUpdatedAt: string;
    lastUpdatedBy: number;
    index?: number;
}

interface ExaminationServiceWithParams extends ExaminationService {
    serviceTestParameters: ServiceTestParameter[];
}

interface SearchFormValues {
    searchKeyword: string;
}

interface ExaminationServiceFormValues {
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: string;
}

interface ModalServiceTestParametersDetailsProps {
    open: boolean;
    service: ExaminationServiceWithParams | null;
    onClose: () => void;
}

function ModalServiceTestParametersDetails({ open, service, onClose }: ModalServiceTestParametersDetailsProps) {
    const { t } = useTranslation();
    const { onGridReady } = useAgGrid({});

    const columns = useMemo(
        () => [
            { headerName: t(i18n.translationKey.parameterName), field: "parameterName", flex: 2, sortable: true },
            { headerName: t(i18n.translationKey.unit), field: "unit", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.standardValue), field: "standardValue", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.equipmentName), field: "equipmentName", flex: 2, sortable: true },
            { headerName: t(i18n.translationKey.specimenType), field: "specimenType", flex: 1, sortable: true },
            {
                headerName: t(i18n.translationKey.serviceListSuspensionStatus),
                field: "isSuspended",
                flex: 1,
                sortable: true,
                cellRenderer: "agCellWrapper",
                valueFormatter: ({ value }: { value: string | boolean }) =>
                    t(`${i18n.translationKey.serviceListSuspensionStatusEnum}.${String(value)}`),
            },
            {
                headerName: t(i18n.translationKey.createdAt),
                field: "createdAt",
                flex: 1,
                sortable: true,
                valueFormatter: ({ value }: { value: string }) => new Date(value).toLocaleString("vi-VN"),
            },
            {
                headerName: t(i18n.translationKey.lastUpdatedAt),
                field: "lastUpdatedAt",
                flex: 1,
                sortable: true,
                valueFormatter: ({ value }: { value: string }) => new Date(value).toLocaleString("vi-VN"),
            },
        ],
        [t],
    );

    if (!service) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                {t(i18n.translationKey.serviceTestParametersDetail)} - {service.serviceName}
            </DialogTitle>
            <DialogContent dividers>
                {service.serviceTestParameters && service.serviceTestParameters.length > 0 ? (
                    <AgDataGrid
                        onGridReady={onGridReady}
                        columnDefs={columns}
                        rowData={service.serviceTestParameters}
                        rowSelection="multiple"
                        pagination
                        pageSize={10}
                        loading={false}
                    />
                ) : (
                    <Box p={2} sx={{ textAlign: "center", color: "text.secondary" }}>
                        <Typography>{t(i18n.translationKey.noParametersAvailable)}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    {t(i18n.translationKey.close)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ExaminationServicePage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { handlePageChange, pageIndex, pageSize } = usePagination();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<ExaminationServiceWithParams | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const { onGridReady } = useAgGrid({ rowSelection: "single" });

    const searchForm = useForm<SearchFormValues>({
        defaultValues: {
            searchKeyword: "",
        },
    });

    const createMutation = useMutationCreateExaminationService();
    const updateMutation = useMutationUpdateExaminationService();
    const deleteMutation = useMutationDeleteExaminationService();

    const [searchInputs, setSearchInputs] = useState<SearchFormValues>({ searchKeyword: "" });
    const debouncedSearchInputs = useDebounce(searchInputs, 500);

    useEffect(() => {
        const subscription = searchForm.watch((value) => {
            setSearchInputs({ searchKeyword: value.searchKeyword || "" });
        });
        return () => subscription.unsubscribe();
    }, [searchForm]);

    const { data, examinationServices, isLoading, refetch } = useQueryExaminationService({
        searchTerm: debouncedSearchInputs.searchKeyword,
    });

    const services = useMemo(() => {
        let list = examinationServices ?? data?.Data ?? [];
        if (debouncedSearchInputs.searchKeyword.trim()) {
            const lower = debouncedSearchInputs.searchKeyword.toLowerCase();
            list = list.filter(
                (svc: ExaminationServiceWithParams) =>
                    svc.serviceCode?.toLowerCase().includes(lower) || svc.serviceName?.toLowerCase().includes(lower),
            );
        }
        return list.map((svc: ExaminationServiceWithParams) => ({
            ...svc,
            serviceCode: svc.serviceCode ?? "",
            serviceName: svc.serviceName ?? "",
            unitPrice: svc.unitPrice ?? 0,
            departmentId: svc.departmentId ?? 0,
            examinationService: 0,
            serviceTestParameters: svc.serviceTestParameters ?? [],
            createdAt: svc.createdAt ?? new Date().toISOString(),
            updatedAt: svc.updatedAt ?? new Date().toISOString(),
        }));
    }, [examinationServices, data, debouncedSearchInputs]);

    const paginatedData = useMemo(() => {
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
        return services.slice(start, end);
    }, [services, pageIndex, pageSize]);

    const totalItems = services.length;

    const handleRowClick = (event: RowClickedEvent<ExaminationServiceWithParams>) => {
        const selected = event.data;
        if (!selected) return;
        setSelectedId(selected.id);
    };

    const handleAdd = () => {
        setSelectedId(null);
        setIsEditOpen(true);
    };

    const handleEdit = () => {
        if (!selectedId) return;
        setIsEditOpen(true);
    };

    const handleDelete = () => {
        if (!selectedId) return;
        setIsDeleteConfirmOpen(true);
    };

    const handleDetails = (record: ExaminationServiceWithParams) => {
        setSelectedRecord(record);
        setIsDetailsOpen(true);
    };

    const handleSave = (
        formData: ExaminationServiceFormValues & { id?: number; serviceTestParameters: ServiceTestParameter[] },
    ) => {
        const departmentId = parseInt(formData.departmentId);
        const payload = {
            serviceCode: formData.serviceCode,
            serviceName: formData.serviceName,
            unitPrice: formData.unitPrice,
            departmentId,
            examinationService: 0,
            serviceTestParameters: formData.serviceTestParameters,
        };

        if (formData.id) {
            updateMutation.mutate(
                {
                    id: formData.id,
                    data: payload,
                },
                {
                    onSuccess: () => {
                        showToast.success(t(i18n.translationKey.updateExaminationServiceSuccess));
                        setIsEditOpen(false);
                        setSelectedId(null);
                        refetch();
                        queryClient.invalidateQueries({ queryKey: ["examinationServices"] });
                    },
                    onError: () => {
                        showToast.error(t(i18n.translationKey.updateExaminationServiceFailed));
                    },
                },
            );
        } else {
            const existingService = services.find((svc) => svc.id === formData.id);
            if (existingService) {
                showToast.error(t(i18n.translationKey.duplicateExaminationIdError));
                return;
            }
            createMutation.mutate(payload, {
                onSuccess: () => {
                    showToast.success(t(i18n.translationKey.createExaminationServiceSuccess));
                    setIsEditOpen(false);
                    setSelectedId(null);
                    refetch();
                    queryClient.invalidateQueries({ queryKey: ["examinationServices"] });
                },
                onError: () => {
                    showToast.error(t(i18n.translationKey.createExaminationServiceFailed));
                },
            });
        }
    };

    const columns = useMemo(
        () => [
            { headerName: t(i18n.translationKey.serviceCode), field: "serviceCode", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.serviceName), field: "serviceName", flex: 2, sortable: true },
            {
                headerName: t(i18n.translationKey.price),
                field: "unitPrice",
                flex: 1,
                valueFormatter: ({ value }: { value: number }) => `${value.toLocaleString("vi-VN")} ₫`,
            },
            {
                headerName: t(i18n.translationKey.testParametersCount),
                field: "serviceTestParameters",
                flex: 1,
                valueFormatter: ({ value }: { value: ServiceTestParameter[] }) =>
                    `${value?.length ?? 0} ${t(i18n.translationKey.parameters)}`,
            },
            {
                headerName: t(i18n.translationKey.actions),
                field: "actions",
                flex: 1,
                cellRenderer: ({ data }: { data: ExaminationServiceWithParams }) => (
                    <Button variant="outlined" size="small" onClick={() => handleDetails(data)}>
                        {t(i18n.translationKey.detail)}
                    </Button>
                ),
            },
        ],
        [t],
    );

    return (
        <Box p={3}>
            <DynamicForm form={searchForm}>
                <Grid container spacing={2} className="px-4 py-5" alignItems="center">
                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                        <ActionButton
                            fullWidth
                            label={t(i18n.translationKey.addNew)}
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
                            disabled={!selectedId}
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
                            disabled={!selectedId}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ pt: { xs: 0, sm: "18px" } }}>
                        <FormItem
                            render="text-input"
                            name="searchKeyword"
                            label={t(i18n.translationKey.searchKeyword)}
                            placeholder={t(i18n.translationKey.search)}
                        />
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ p: 2 }}>
                    <AgDataGrid
                        onGridReady={onGridReady}
                        columnDefs={columns}
                        rowData={paginatedData}
                        onRowClicked={handleRowClick}
                        rowSelection="single"
                        pagination
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        loading={isLoading}
                    />
                </Grid>
            </DynamicForm>
            <ModalEditExaminationService
                open={isEditOpen}
                defaultValues={services.find((s) => s.id === selectedId) ?? null}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSave}
            />
            <ConfirmPasswordDialog
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirmed={() => {
                    if (!selectedId) return;
                    deleteMutation.mutate(selectedId, {
                        onSuccess: () => {
                            showToast.success(t(i18n.translationKey.deleteExaminationServiceSuccess));
                            setSelectedId(null);
                            setIsDeleteConfirmOpen(false);
                            refetch();
                            queryClient.invalidateQueries({ queryKey: ["examinationServices"] });
                        },
                        onError: () => {
                            showToast.error(t(i18n.translationKey.deleteExaminationServiceFailed));
                        },
                    });
                }}
            />
            <ModalServiceTestParametersDetails
                open={isDetailsOpen}
                service={selectedRecord}
                onClose={() => setIsDetailsOpen(false)}
            />
        </Box>
    );
}
