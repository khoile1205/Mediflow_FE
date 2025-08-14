import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
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
import usePagination from "~/hooks/use-pagination";
import { useMutationCreateHospitalService } from "~/services/hospital-service/hooks/mutations/use-mutation-create-hospital-service";
import { useMutationDeleteHospitalService } from "~/services/hospital-service/hooks/mutations/use-mutation-delete-hospital-service";
import { useMutationUpdateHospitalService } from "~/services/hospital-service/hooks/mutations/use-mutation-update-hospital-service";
import { useQueryGetHospitalServices } from "~/services/hospital-service/hooks/queries/use-query-get-hospital-services";
import { useQueryDepartmentById } from "~/services/management/department/hooks/queries/use-query-department-by-id";
import { useQueryDepartmentsWithPagination } from "~/services/management/department/hooks/queries/use-query-departments-with-pagination";
import { showToast } from "~/utils";
import { ConfirmPasswordDialog } from "../management/medicine/ConfirmPasswordDialog";
import useDebounce from "~/hooks/use-debounce";

interface HospitalService {
    id: number;
    serviceCode: string;
    serviceName: string;
    serviceType: number;
    unitPrice: number;
    departmentId: number;
    examinationService: number | null;
}

interface SearchFormValues {
    searchKeyword: string;
}

interface ServiceFormValues {
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: number;
}

interface ModalEditServiceProps {
    open: boolean;
    defaultValues: HospitalService | null;
    onClose: () => void;
    onSave: (data: ServiceFormValues & { id?: string }) => void;
}

function ModalEditService({ open, defaultValues, onClose, onSave }: ModalEditServiceProps) {
    const { t } = useTranslation();

    const { data: departmentData } = useQueryDepartmentsWithPagination({
        pageIndex: 1,
        pageSize: 1000,
    });

    const form = useForm<ServiceFormValues>({
        defaultValues: {
            serviceCode: "",
            serviceName: "",
            unitPrice: 0,
            departmentId: 0,
        },
    });

    useEffect(() => {
        if (open && defaultValues) {
            form.reset({
                serviceCode: defaultValues.serviceCode || "",
                serviceName: defaultValues.serviceName || "",
                unitPrice: defaultValues.unitPrice || 0,
                departmentId: defaultValues.departmentId || 0,
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = () => {
        const values = form.getValues();
        onSave({
            id: defaultValues?.id?.toString(),
            serviceCode: values.serviceCode,
            serviceName: values.serviceName,
            unitPrice: values.unitPrice,
            departmentId: values.departmentId,
        });
    };

    const departmentOptions = useMemo(() => {
        if (!departmentData?.listDepartments) return [];
        return departmentData.listDepartments.map((dept) => ({
            value: dept.id,
            label: dept.name,
        }));
    }, [departmentData]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {defaultValues
                    ? t(i18n.translationKey.editHospitalService)
                    : t(i18n.translationKey.createHospitalService)}
            </DialogTitle>
            <DialogContent dividers>
                <DynamicForm form={form}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <FormItem
                                name="serviceCode"
                                label={t(i18n.translationKey.serviceCode)}
                                render="text-input"
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormItem
                                name="serviceName"
                                label={t(i18n.translationKey.serviceName)}
                                render="text-input"
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormItem
                                name="unitPrice"
                                label={t(i18n.translationKey.unitPrice)}
                                render="input-number"
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormItem
                                name="departmentId"
                                label={t(i18n.translationKey.department)}
                                render="autocomplete"
                                options={departmentOptions}
                                required
                            />
                        </Grid>
                    </Grid>
                </DynamicForm>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    {t(i18n.translationKey.cancel)}
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    {t(i18n.translationKey.save)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const DepartmentCell = ({ departmentId }: { departmentId: number }) => {
    const { data } = useQueryDepartmentById(departmentId);
    return <span>{data?.department?.name || `Department ${departmentId}`}</span>;
};

export default function ServiceListPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { handlePageChange, pageIndex, pageSize } = usePagination();
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const { onGridReady } = useAgGrid({ rowSelection: "single" });

    const searchForm = useForm<SearchFormValues>({
        defaultValues: {
            searchKeyword: "",
        },
    });

    const createService = useMutationCreateHospitalService();
    const deleteService = useMutationDeleteHospitalService();
    const updateService = useMutationUpdateHospitalService();

    const [searchInputs, setSearchInputs] = useState<SearchFormValues>({
        searchKeyword: "",
    });

    const debouncedSearchInputs = useDebounce(searchInputs, 500);

    useEffect(() => {
        const subscription = searchForm.watch((value) => {
            setSearchInputs({
                searchKeyword: value.searchKeyword,
            });
        });
        return () => subscription.unsubscribe();
    }, [searchForm]);

    const { data: serviceData, isLoading, refetch } = useQueryGetHospitalServices({});

    useEffect(() => {
        refetch();
    }, [debouncedSearchInputs, refetch]);

    const services = useMemo<HospitalService[]>(() => {
        const rawData = serviceData?.Data ?? [];

        return rawData
            .filter((svc) => svc.examinationService === null)
            .filter((svc) => {
                if (!debouncedSearchInputs.searchKeyword.trim()) return true;
                const lower = debouncedSearchInputs.searchKeyword.toLowerCase();
                return svc.serviceCode?.toLowerCase().includes(lower) || svc.serviceName?.toLowerCase().includes(lower);
            })
            .map((svc) => ({
                id: svc.id,
                serviceCode: svc.serviceCode ?? "",
                serviceName: svc.serviceName ?? "",
                serviceType: (svc as any).serviceType ?? 0,
                unitPrice: svc.unitPrice ?? 0,
                departmentId: svc.departmentId ?? 0,
                examinationService:
                    svc.examinationService &&
                    typeof svc.examinationService === "object" &&
                    "id" in svc.examinationService
                        ? (svc.examinationService as any).id
                        : (svc.examinationService ?? null),
            }))
            .sort((a, b) => a.serviceCode.localeCompare(b.serviceCode));
    }, [serviceData, debouncedSearchInputs]);

    const paginatedServices = useMemo(() => {
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
        return services.slice(start, end);
    }, [services, pageIndex, pageSize]);

    const totalItems = services.length;

    const handleRowClick = (event: RowClickedEvent<HospitalService>) => {
        const selected = event.data;
        if (!selected) return;
        setSelectedServiceId(selected.id);
    };

    const handleAdd = () => {
        setSelectedServiceId(null);
        setIsEditOpen(true);
    };

    const handleEditService = () => {
        if (!selectedServiceId) return;
        setIsEditOpen(true);
    };

    const handleDeleteService = () => {
        if (!selectedServiceId) return;
        setIsDeleteConfirmOpen(true);
    };

    const handleSaveService = async (serviceData: {
        id?: string;
        serviceCode: string;
        serviceName: string;
        unitPrice: number;
        departmentId: number;
    }) => {
        if (serviceData.id) {
            updateService.mutate(
                {
                    id: Number(serviceData.id),
                    serviceCode: serviceData.serviceCode,
                    serviceName: serviceData.serviceName,
                    unitPrice: serviceData.unitPrice,
                    departmentId: serviceData.departmentId,
                },
                {
                    onSuccess: () => {
                        showToast.success(t(i18n.translationKey.updateHospitalServiceSuccess));
                        setIsEditOpen(false);
                        setSelectedServiceId(null);
                        refetch();
                        queryClient.invalidateQueries({ queryKey: ["hospitalServices"] });
                    },
                    onError: () => {
                        showToast.error(t(i18n.translationKey.updateHospitalServiceFailed));
                    },
                },
            );
        } else {
            const existingService = services.find((svc) => svc.serviceCode === serviceData.serviceCode);
            if (existingService) {
                showToast.error(t(i18n.translationKey.duplicateServiceCodeError));
                return;
            }
            createService.mutate(
                {
                    serviceCode: serviceData.serviceCode,
                    serviceName: serviceData.serviceName,
                    unitPrice: serviceData.unitPrice,
                    departmentId: serviceData.departmentId,
                },
                {
                    onSuccess: () => {
                        showToast.success(t(i18n.translationKey.createHospitalServiceSuccess));
                        setIsEditOpen(false);
                        setSelectedServiceId(null);
                        refetch();
                        queryClient.invalidateQueries({ queryKey: ["hospitalServices"] });
                    },
                    onError: () => {
                        showToast.error(t(i18n.translationKey.createHospitalServiceFailed));
                    },
                },
            );
        }
    };

    const columns = useMemo(
        () => [
            { headerName: t(i18n.translationKey.serviceCode), field: "serviceCode", flex: 1, sortable: true },
            { headerName: t(i18n.translationKey.serviceName), field: "serviceName", flex: 2, sortable: true },
            {
                headerName: t(i18n.translationKey.unitPrice),
                field: "unitPrice",
                flex: 1,
                valueFormatter: ({ value }: { value: number }) => `${value?.toLocaleString("vi-VN")} ₫`,
            },
            {
                headerName: t(i18n.translationKey.department),
                field: "departmentId",
                flex: 1,
                cellRenderer: ({ value }: { value: number }) => <DepartmentCell departmentId={value} />,
            },
        ],
        [t],
    );

    return (
        <Box p={3}>
            <DynamicForm form={searchForm}>
                <Grid container spacing={2} className="px-4 py-5" alignItems="center" justifyContent="flex-start">
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
                            onClick={handleEditService}
                            disabled={!selectedServiceId}
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
                            onClick={handleDeleteService}
                            disabled={!selectedServiceId}
                            sx={{ borderRadius: 4 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ pt: "18px" }}>
                        <FormItem
                            render="text-input"
                            name="searchKeyword"
                            label={t(i18n.translationKey.searchKeyword)}
                            placeholder={t(i18n.translationKey.search)}
                        />
                    </Grid>
                </Grid>

                <Grid size={12} p={2}>
                    <AgDataGrid
                        onGridReady={onGridReady}
                        columnDefs={columns}
                        rowData={paginatedServices}
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

            <ModalEditService
                open={isEditOpen}
                defaultValues={services.find((s) => s.id === selectedServiceId) || null}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSaveService}
            />

            <ConfirmPasswordDialog
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirmed={() => {
                    if (!selectedServiceId) return;
                    deleteService.mutate(selectedServiceId, {
                        onSuccess: () => {
                            showToast.success(t(i18n.translationKey.deleteHospitalServiceSuccess));
                            setSelectedServiceId(null);
                            setIsDeleteConfirmOpen(false);
                            refetch();
                            queryClient.invalidateQueries({ queryKey: ["hospitalServices"] });
                        },
                        onError: () => {
                            showToast.error(t(i18n.translationKey.deleteHospitalServiceFailed));
                        },
                    });
                }}
            />
        </Box>
    );
}
