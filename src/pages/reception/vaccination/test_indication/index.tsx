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
import { Department, DiseaseGroup, ServiceGroup } from "~/entities";
import { getAxiosErrorMessageKey } from "~/libs/axios/helper";
import { IPagination } from "~/libs/axios/types";
import { hospitalServiceService } from "~/services/hospital-service";
import { departmentService } from "~/services/management/department";
import { showToast } from "~/utils";
import { formatCurrencyVND } from "~/utils/currency";
import { TestExaminationGroupType, TestExaminationIndicationFormValue } from "../types";
import { useMutationAddServiceReception } from "~/services/reception/hooks/mutations";

interface TableRowData {
    key: string;
    requestId: string;
    serviceCode: string;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    invoiceDate: string;
    payment: string;
}

interface TestIndicationProps {
    receptionId?: number;
    disabled?: boolean;
}

export const TestIndication: React.FC<TestIndicationProps> = ({ disabled, receptionId }) => {
    const { t, i18n: reactI18n } = useTranslation();
    const form = useForm<TestExaminationIndicationFormValue>({
        defaultValues: {
            receptionId: receptionId || 0,
            services: [],
            groupId: 0,
            defaultQuantity: 1,
        },
    });
    const { mutate: addServiceReception } = useMutationAddServiceReception();
    // TODO: change to service type
    const [_, setHospitalServiceGroup] = React.useState<ServiceGroup[]>([]);
    const [hospitalDiseaseGroup, setHospitalDiseaseGroup] = React.useState<DiseaseGroup[]>([]);
    const [departmentPagination, setDepartmentPagination] = React.useState<IPagination<Department>>();

    const agGrid = useAgGrid<TableRowData>({ rowSelection: "multiple" });
    const columnDefs: ColDef<TableRowData>[] = React.useMemo(
        () => [
            {
                checkboxSelection: true,
                headerCheckboxSelection: true,
                width: 50,
                pinned: true,
                resizable: false,
            },
            { field: "requestId", headerName: t(i18n.translationKey.requestNumber) },
            { field: "serviceCode", headerName: t(i18n.translationKey.serviceCode) },
            { field: "serviceName", headerName: t(i18n.translationKey.serviceName) },
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
            { field: "invoiceDate", headerName: t(i18n.translationKey.invoiceDate) },
            { field: "payment", headerName: t(i18n.translationKey.payment) },
        ],
        [],
    );

    // TODO: implement the logic to add service reception by disease group and service group
    const handleAddDiseaseGroup = async (data: TestExaminationIndicationFormValue) => {
        if (!data.groupId) {
            showToast.error(t(i18n.translationKey.pleaseSelectDiseaseGroupBeforeAdding));
            return;
        }

        try {
            await addServiceReception({
                receptionId: data.receptionId,
                services: data.services,
                groupType: TestExaminationGroupType.DISEASE_GROUP,
                groupId: data.groupId,
                defaultQuantity: data.defaultQuantity,
            });
        } catch (error) {
            showToast.error(t(getAxiosErrorMessageKey(error)));
        }
    };

    // TODO: implement the logic to add service reception by service group
    const handleAddServiceGroup = (data: TestExaminationIndicationFormValue) => {
        if (!data.services.length) {
            showToast.error(t(i18n.translationKey.pleaseSelectServiceBeforeAdding));
            return;
        }
    };

    const getAllHospitalServiceGroups = async (searchTerms: string = "") => {
        try {
            const response = await hospitalServiceService.getAllHospitalServiceGroup({ searchTerms });
            setHospitalServiceGroup(response.Data);
        } catch (error) {
            showToast.error(t(getAxiosErrorMessageKey(error)));
        }
    };

    const getAllHospitalDiseaseGroups = async (searchTerms: string = "") => {
        try {
            const response = await hospitalServiceService.getAllHospitalDiseaseGroup({ searchTerms });
            setHospitalDiseaseGroup(response.Data);
        } catch (error) {
            showToast.error(t(getAxiosErrorMessageKey(error)));
        }
    };

    const getListDepartments = async (pageIndex: number = 1) => {
        try {
            const response = await departmentService.getDepartmentWithPagination({ pageIndex });
            setDepartmentPagination(response.Data);
        } catch (error) {
            showToast.error(t(getAxiosErrorMessageKey(error)));
        }
    };

    const initializeData = async () => {
        await Promise.all([
            getAllHospitalServiceGroups(),
            getAllHospitalDiseaseGroups(),
            getListDepartments(),
            // getAllHospitalService(),
        ]);
    };

    React.useEffect(() => {
        initializeData();
    }, []);

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
                                    name="diseaseGroup"
                                    placeholder={t(i18n.translationKey.selectDiseaseGroup)}
                                    disabled={disabled}
                                    options={toBaseOption<DiseaseGroup>(hospitalDiseaseGroup, {
                                        label: "groupName",
                                        value: "id",
                                    })}
                                />
                            </Grid>

                            <Grid size={7}>
                                <FormItem
                                    render="select"
                                    label={t(i18n.translationKey.examinationIndication)}
                                    name="services"
                                    placeholder={t(i18n.translationKey.selectExaminationService)}
                                    disabled={disabled}
                                    options={[{ label: "", value: "" }]}
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
                                    rowData={departmentPagination?.data ?? []}
                                    pageIndex={departmentPagination?.pageIndex ?? 1}
                                    pageSize={departmentPagination?.pageSize ?? 10}
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
                            rowData={[]}
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
