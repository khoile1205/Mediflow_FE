import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { AgDataGrid, useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { useForm } from "~/components/form/hooks/use-form";
import { toBaseOption } from "~/components/form/utils";
import i18n from "~/configs/i18n";
import { I18N_LANGUAGE } from "~/configs/i18n/types";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { DiseaseGroup, Service } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryHospitalDiseaseGroup, useQueryHospitalServices } from "~/services/hospital-service/hooks/queries";
import { useQueryDepartmentsWithPagination } from "~/services/management/department/hooks/queries";
import { useMutationAddServiceReception } from "~/services/reception/hooks/mutations";
import { ReceptionUnpaidService } from "~/services/reception/infras/types";
import { showToast } from "~/utils";
import { formatCurrencyVND } from "~/utils/currency";
import { formatDate } from "~/utils/date-time";
import { TestExaminationGroupType, TestExaminationIndicationFormValue } from "../types";

interface TestIndicationProps {
    receptionId?: number;
    disabled?: boolean;
    unpaidServices?: ReceptionUnpaidService[];
}

export const TestIndication: React.FC<TestIndicationProps> = ({ disabled, receptionId, unpaidServices = [] }) => {
    const { t, i18n: reactI18n } = useTranslation();
    const { pageIndex, pageSize, handlePageChange } = usePagination();

    // Queries hooks
    const {
        data: { hospitalDiseaseGroups },
    } = useQueryHospitalDiseaseGroup();
    const {
        data: { hospitalServices },
    } = useQueryHospitalServices();
    const {
        data: { listDepartments, totalItems },
    } = useQueryDepartmentsWithPagination({
        pageIndex,
        pageSize,
    });

    // Mutations hooks
    const { mutateAsync: addServiceReception } = useMutationAddServiceReception();

    const form = useForm<TestExaminationIndicationFormValue>({
        defaultValues: {
            services: [],
            groupId: 0,
            defaultQuantity: 1,
        },
    });

    const agGrid = useAgGrid<ReceptionUnpaidService>({ rowSelection: "multiple" });
    const columnDefs: ColDef<ReceptionUnpaidService>[] = React.useMemo(
        () => [
            {
                checkboxSelection: true,
                headerCheckboxSelection: true,
                width: 50,
                pinned: true,
                resizable: false,
            },
            { field: "requestNumber", headerName: t(i18n.translationKey.requestNumber), cellClass: "ag-cell-center" },
            { field: "serviceName", headerName: t(i18n.translationKey.serviceName), cellClass: "ag-cell-center" },
            { field: "quantity", headerName: t(i18n.translationKey.quantity), cellClass: "ag-cell-center" },
            {
                field: "unitPrice",
                headerName: t(i18n.translationKey.unitPrice),
                cellClass: "ag-cell-center",
                valueFormatter: (params) => formatCurrencyVND(params.value),
            },
            {
                headerName: t(i18n.translationKey.totalAmount),
                cellClass: "ag-cell-center",
                valueGetter: (params) => params.data.quantity * params.data.unitPrice,
                valueFormatter: (params) => formatCurrencyVND(params.value),
            },
            {
                field: "createdAt",
                cellClass: "ag-cell-center",
                headerName: t(i18n.translationKey.invoiceDate),
                valueFormatter: (params) => formatDate(params.value, DATE_TIME_FORMAT["dd/MM/yyyy HH:mm"]),
            },
        ],
        [],
    );

    // TODO: implement the logic to add service reception by disease group and service group
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

    // TODO: implement the logic to add service reception by service group
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

    return (
        <DynamicForm form={form}>
            <Stack spacing={2} direction="column" className="pt-3">
                <Box>
                    <Typography variant="subtitle2" className="ms-2 text-lg font-bold">
                        {t(i18n.translationKey.examinationIndication)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "primary.main", borderRadius: 2 }}>
                        <Grid container spacing={2.5}>
                            <Grid size={12}>
                                <FormItem
                                    render="autocomplete"
                                    label={t(i18n.translationKey.orderByDiseaseGroup)}
                                    name="groupId"
                                    placeholder={t(i18n.translationKey.selectDiseaseGroup)}
                                    disabled={disabled}
                                    options={toBaseOption<DiseaseGroup>(hospitalDiseaseGroups, {
                                        label: "groupName",
                                        value: "id",
                                    })}
                                />
                            </Grid>

                            <Grid size={7}>
                                <FormItem
                                    render="select"
                                    label={t(i18n.translationKey.examinationIndication)}
                                    name="serviceId"
                                    placeholder={t(i18n.translationKey.selectExaminationService)}
                                    disabled={disabled}
                                    options={toBaseOption<Service>(hospitalServices, {
                                        label: "serviceName",
                                        value: "id",
                                    })}
                                />
                            </Grid>

                            <Grid size={4}>
                                <FormItem
                                    render="data-grid"
                                    label={t(i18n.translationKey.department)}
                                    placeholder={t(i18n.translationKey.selectDepartment)}
                                    name="department"
                                    disabled={disabled}
                                    columnDefs={[
                                        { field: "code", headerName: t(i18n.translationKey.departmentCode) },
                                        {
                                            field: "departmentName",
                                            headerName: t(i18n.translationKey.department),
                                            valueGetter: (params) => {
                                                const lang = reactI18n.language;
                                                return lang === I18N_LANGUAGE.VIETNAMESE
                                                    ? params.data.name
                                                    : params.data.nameInEnglish;
                                            },
                                        },
                                    ]}
                                    pagination
                                    rowData={listDepartments}
                                    pageIndex={pageIndex}
                                    pageSize={pageSize}
                                    totalItems={totalItems}
                                    onPageChange={handlePageChange}
                                    colField={
                                        reactI18n.language === I18N_LANGUAGE.VIETNAMESE ? "name" : "nameInEnglish"
                                    }
                                />
                            </Grid>

                            <Grid size={1}>
                                <FormItem
                                    render="input-number"
                                    name="defaultQuantity"
                                    label={t(i18n.translationKey.quantity)}
                                    placeholder={t(i18n.translationKey.quantity)}
                                    disabled={disabled}
                                    required
                                    minNumber={1}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Stack direction="row" spacing={2}>
                                    <ActionButton
                                        label={t(i18n.translationKey.addByGroup)}
                                        startIcon={<AddCircle />}
                                        onClick={form.handleSubmit(handleAddDiseaseGroup)}
                                        disabled={disabled}
                                    />
                                    <ActionButton
                                        label={t(i18n.translationKey.addHospitalService)}
                                        startIcon={<AddCircle />}
                                        onClick={form.handleSubmit(handleAddServiceGroup)}
                                        disabled={disabled}
                                    />
                                    <ActionButton
                                        label={t(i18n.translationKey.delete)}
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
                        {t(i18n.translationKey.examinationIndicationList)}
                    </Typography>
                    <Box className="mt-2 border p-5" sx={{ borderColor: "primary.main", borderRadius: 2 }}>
                        <AgDataGrid
                            columnDefs={columnDefs}
                            rowData={unpaidServices}
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
