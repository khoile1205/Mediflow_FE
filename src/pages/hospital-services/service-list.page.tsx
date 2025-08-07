import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { HospitalService } from "./types";

interface SearchFormValues {
    searchTerm: string;
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
        if (open) {
            form.reset({
                serviceCode: defaultValues?.serviceCode || "",
                serviceName: defaultValues?.serviceName || "",
                unitPrice: defaultValues?.unitPrice || 0,
                departmentId: defaultValues?.departmentId || 0,
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

    const [selectedService, setSelectedService] = useState<HospitalService | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const searchForm = useForm<SearchFormValues>({ defaultValues: { searchTerm: "" } });
    const [, setSearchTerm] = useState("");

    const { handlePageChange, pageIndex, pageSize, resetPagination } = usePagination();

    useEffect(() => {
        const sub = searchForm.watch((v) => {
            setSearchTerm(v.searchTerm || "");
            resetPagination();
        });
        return () => sub.unsubscribe();
    }, [searchForm, resetPagination]);

    const { data: serviceData, isLoading, refetch } = useQueryGetHospitalServices();

    const createService = useMutationCreateHospitalService();
    const deleteService = useMutationDeleteHospitalService();
    const updateService = useMutationUpdateHospitalService();

    const { onGridReady } = useAgGrid({ rowSelection: "single" });

    const columns = useMemo(
        () => [
            { headerName: t(i18n.translationKey.serviceCode), field: "serviceCode", flex: 1 },
            { headerName: t(i18n.translationKey.serviceName), field: "serviceName", flex: 2 },
            { headerName: t(i18n.translationKey.unitPrice), field: "unitPrice", flex: 1 },
            {
                headerName: t(i18n.translationKey.department),
                field: "departmentId",
                flex: 1,
                cellRenderer: ({ value }: any) => <DepartmentCell departmentId={value} />,
            },
            {
                headerName: t(i18n.translationKey.actions),
                field: "actions",
                flex: 1,
                cellRenderer: ({ data }: any) => (
                    <>
                        <Button startIcon={<Edit />} onClick={() => handleEditService(data)} size="small">
                            {t(i18n.translationKey.edit)}
                        </Button>
                        <Button
                            startIcon={<Delete />}
                            onClick={() => handleDeleteService(data.id)}
                            size="small"
                            color="error"
                        >
                            {t(i18n.translationKey.delete)}
                        </Button>
                    </>
                ),
            },
        ],
        [t],
    );

    const handleAdd = () => {
        setSelectedService(null);
        setIsEditOpen(true);
    };

    const handleEditService = (service: HospitalService) => {
        setSelectedService(service);
        setIsEditOpen(true);
    };

    const handleDeleteService = (serviceId: string) => {
        setSelectedService((prev) => (prev?.id === Number(serviceId) ? prev : { ...prev!, id: Number(serviceId) }));
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
                        refetch();
                        queryClient.invalidateQueries({ queryKey: ["hospitalServices"] });
                    },
                    onError: () => {
                        showToast.error(t(i18n.translationKey.updateHospitalServiceFailed));
                    },
                },
            );
        } else {
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

    return (
        <Box p={3}>
            <DynamicForm form={searchForm}>
                <Grid container spacing={2} alignItems="center" justifyContent="flex-start" className="px-4 py-5">
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Button fullWidth startIcon={<AddCircle />} variant="contained" onClick={handleAdd}>
                            {t(i18n.translationKey.add)}
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                        <FormItem
                            render="text-input"
                            name="searchTerm"
                            label={t(i18n.translationKey.search)}
                            placeholder={t(i18n.translationKey.searchPlaceholder)}
                        />
                    </Grid>
                </Grid>
            </DynamicForm>

            <Grid size={{ xs: 12 }}>
                <AgDataGrid
                    onGridReady={onGridReady}
                    columnDefs={columns}
                    rowData={serviceData?.Data ?? []}
                    pagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalItems={serviceData?.Data?.length ?? 0}
                    onPageChange={handlePageChange}
                    loading={isLoading}
                    rowSelection="single"
                    onRowClicked={(e) => setSelectedService(e.data)}
                />
            </Grid>

            <ModalEditService
                open={isEditOpen}
                defaultValues={selectedService}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSaveService}
            />

            <ConfirmPasswordDialog
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirmed={() => {
                    if (!selectedService) return;
                    deleteService.mutate(selectedService.id, {
                        onSuccess: () => {
                            showToast.success(t(i18n.translationKey.deleteHospitalServiceSuccess));
                            refetch();
                            setSelectedService(null);
                            setIsDeleteConfirmOpen(false);
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
