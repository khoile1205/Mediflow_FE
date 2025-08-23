import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { toBaseOption } from "~/components/form/utils";
import i18n from "~/configs/i18n";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { HospitalServiceType } from "~/constants/enums";
import { Service } from "~/entities";
import { useQueryHospitalServices } from "~/services/hospital-service/hooks/queries";
import {
    useMutationAddServiceReception,
    useMutationDeleteServiceReception,
} from "~/services/reception/hooks/mutations";
import { useQueryServiceReceptionByReceptionId } from "~/services/reception/hooks/queries";
import { VaccinationServiceReception } from "~/services/reception/infras/types";
import { showToast } from "~/utils";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";
import { TestExaminationGroupType, TestExaminationIndicationFormValue } from "../types";

interface TestIndicationProps {
    receptionId?: number;
    // disabled?: boolean;
    isReferredToHospital?: boolean;
    form: UseFormReturn<TestExaminationIndicationFormValue>;
}

export const TestIndication: React.FC<TestIndicationProps> = ({
    // disabled,
    receptionId,
    isReferredToHospital,
    form,
}) => {
    const { t } = useTranslation();
    // const { pageIndex, pageSize, handlePageChange } = usePagination();

    const [selectedRowsCount, setSelectedRowsCount] = React.useState<number>(0);

    // Queries hooks
    const { listServiceReception } = useQueryServiceReceptionByReceptionId(receptionId);

    // const {
    //     data: { hospitalDiseaseGroups },
    // } = useQueryHospitalDiseaseGroup();
    const {
        data: { hospitalServices },
    } = useQueryHospitalServices({ serviceType: HospitalServiceType.Test });
    const {
        data: { hospitalServices: examHospitalServices },
    } = useQueryHospitalServices({ serviceType: HospitalServiceType.Exam });
    const {
        data: { hospitalServices: injectHospitalServices },
    } = useQueryHospitalServices({ serviceType: HospitalServiceType.Injection });
    // const {
    //     data: { listDepartments, totalItems },
    // } = useQueryDepartmentsWithPagination({
    //     pageIndex,
    //     pageSize,
    // });

    // Mutations hooks
    const { mutateAsync: addServiceReception } = useMutationAddServiceReception();
    const { mutateAsync: deleteServiceReception } = useMutationDeleteServiceReception();

    const agGrid = useAgGrid<VaccinationServiceReception>({ rowSelection: "multiple" });

    const onSubmitVaccinationPrescreening = async (
        data: TestExaminationIndicationFormValue,
        type: TestExaminationGroupType,
    ) => {
        if (!isReferredToHospital) {
            showToast.info(t(i18n.translationKey.noNeedToTakeReferExam));
            return;
        }

        if (type === TestExaminationGroupType.DISEASE_GROUP) {
            await handleAddDiseaseGroup(data);
        } else {
            await handleAddServiceGroup(data);
        }
    };

    const handleAddDiseaseGroup = async (data: TestExaminationIndicationFormValue) => {
        if (!data.groupId) {
            showToast.error(t(i18n.translationKey.pleaseSelectDiseaseGroupBeforeAdding));
            return;
        }

        await addServiceReception({
            receptionId,
            services: [],
            groupType: TestExaminationGroupType.DISEASE_GROUP,
            groupId: data.groupId,
            defaultQuantity: data.defaultQuantity,
        });

        form.reset();
    };

    const handleAddServiceGroup = async (data: TestExaminationIndicationFormValue) => {
        if (!data.serviceId) {
            showToast.error(t(i18n.translationKey.pleaseSelectServiceBeforeAdding));
            return;
        }

        await addServiceReception({
            receptionId,
            services: [{ quantity: data.defaultQuantity, serviceId: data.serviceId }],
            groupType: TestExaminationGroupType.SERVICE_GROUP,
            groupId: data.groupId,
            defaultQuantity: data.defaultQuantity,
        });

        form.reset();
    };

    const handleDeleteServiceReception = async () => {
        const selectedServices = agGrid.gridApi.getSelectedRows();
        const listServiceIds = selectedServices.map((row) => row.serviceId);
        await deleteServiceReception({
            receptionId,
            listServiceIds,
        });
    };

    const handleSelectionChanged = () => {
        setSelectedRowsCount(agGrid.gridApi.getSelectedRows().length);
    };

    const examinationHospitalServices = React.useMemo(() => {
        return listServiceReception.filter((item) => {
            const hospitalService = [...examHospitalServices, ...injectHospitalServices].map(
                (service) => service.serviceCode,
            );

            return !hospitalService.includes(item.serviceCode);
        });
    }, [listServiceReception, examHospitalServices, injectHospitalServices]);

    return (
        <DynamicForm form={form}>
            <Stack spacing={2} direction="column" className="pt-3">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        {t(i18n.translationKey.examinationIndication)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "primary.main", borderRadius: 2 }}>
                        <Grid container spacing={2.5}>
                            <Grid size={9}>
                                <FormItem
                                    render="select"
                                    label={t(i18n.translationKey.examinationIndication)}
                                    name="serviceId"
                                    placeholder={t(i18n.translationKey.selectExaminationService)}
                                    disabled={!receptionId}
                                    options={toBaseOption<Service>(hospitalServices, {
                                        label: "serviceName",
                                        value: "id",
                                    })}
                                />
                            </Grid>

                            <Grid size={3}>
                                <FormItem
                                    render="input-number"
                                    name="defaultQuantity"
                                    label={t(i18n.translationKey.quantity)}
                                    placeholder={t(i18n.translationKey.quantity)}
                                    disabled={!receptionId}
                                    required
                                    minNumber={1}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Stack direction="row" spacing={2}>
                                    <ActionButton
                                        label={t(i18n.translationKey.addHospitalService)}
                                        startIcon={<AddCircle />}
                                        onClick={form.handleSubmit((data) =>
                                            onSubmitVaccinationPrescreening(
                                                data,
                                                TestExaminationGroupType.SERVICE_GROUP,
                                            ),
                                        )}
                                        disabled={!receptionId}
                                    />
                                    <ActionButton
                                        label={t(i18n.translationKey.delete)}
                                        startIcon={<Delete />}
                                        onClick={handleDeleteServiceReception}
                                        color="error"
                                        disabled={!receptionId || selectedRowsCount === 0}
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
                            columnDefs={[
                                {
                                    checkboxSelection: true,
                                    headerCheckboxSelection: true,
                                    width: 50,
                                    pinned: true,
                                    resizable: false,
                                },
                                {
                                    field: "requestNumber",
                                    headerName: t(i18n.translationKey.requestNumber),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                },
                                {
                                    field: "serviceName",
                                    headerName: t(i18n.translationKey.serviceName),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                },
                                {
                                    field: "quantity",
                                    headerName: t(i18n.translationKey.quantity),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                },
                                {
                                    field: "unitPrice",
                                    headerName: t(i18n.translationKey.unitPrice),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                    valueFormatter: (params) => formatCurrencyVND(params.value),
                                },
                                {
                                    headerName: t(i18n.translationKey.totalAmount),
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                    valueGetter: (params) => params.data.quantity * params.data.unitPrice,
                                    valueFormatter: (params) => formatCurrencyVND(params.value),
                                },
                                {
                                    field: "invoiceDate",
                                    cellClass: "ag-cell-center",
                                    flex: 1,
                                    headerName: t(i18n.translationKey.invoiceDate),
                                    valueGetter: (params) => {
                                        const invoiceDate = params.data.invoiceDate;
                                        if (!invoiceDate) {
                                            return t(i18n.translationKey.notAvailable);
                                        }
                                        return formatDate(invoiceDate, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]);
                                    },
                                },
                            ]}
                            rowData={examinationHospitalServices}
                            onSelectionChanged={handleSelectionChanged}
                            {...agGrid}
                        />
                    </Box>
                </Box>
            </Stack>
        </DynamicForm>
    );
};

export default TestIndication;
