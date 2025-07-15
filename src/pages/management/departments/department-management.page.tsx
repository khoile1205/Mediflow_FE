import { Grid } from "@mui/material";
import { RowSelectedEvent } from "node_modules/ag-grid-community/dist/types/src/events";
import { useTranslation } from "react-i18next";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { Department } from "~/entities";
import {
    useQueryDepartmentById,
    useQueryDepartmentsWithPagination,
    useQueryDepartmentTypes,
} from "~/services/management/department/hooks/queries";
import { useDepartmentForm } from "./hooks";
import { ActionButton } from "~/components/common/action-button";
import { AddCircle, Save } from "@mui/icons-material";
import { DepartmentFormValues } from "./types";
import { useEffect, useState } from "react";
import { I18N_LANGUAGE } from "~/configs/i18n/types";
import i18n from "~/configs/i18n";
import {
    useMutationCreateDepartment,
    useMutationUpdateDepartment,
} from "~/services/management/department/hooks/mutations";
import { useAgGrid } from "~/components/common/ag-grid";
import { usePagination } from "~/hooks";

export const DepartmentMangement: React.FC = () => {
    const { t, i18n: reactI18n } = useTranslation();

    const [isFormEnabled, setIsFormEnabled] = useState(false);
    const [isAddingNewDepartment, setIsAddingNewDepartment] = useState(false);
    const [isEditingDepartment, setIsEditingDepartment] = useState(false);

    const { handlePageChange, pageIndex, pageSize } = usePagination();

    const {
        data: { listDepartments, totalItems },
    } = useQueryDepartmentsWithPagination({
        pageIndex: pageIndex,
        pageSize: pageSize,
    });

    const {
        data: { listDepartmentTypes },
    } = useQueryDepartmentTypes();

    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
    const {
        data: { department },
    } = useQueryDepartmentById(selectedDepartmentId);

    const form = useDepartmentForm();

    const handleSelectDepartment = (selectedRow: RowSelectedEvent<Department>) => {
        if (!selectedRow) {
            form.reset();
            setIsFormEnabled(false);
            return;
        }

        setSelectedDepartmentId(selectedRow.data.id);
        setIsAddingNewDepartment(false);
    };

    useEffect(() => {
        if (department) {
            form.reset();
            form.setValue("id", department.id);
            form.setValue("code", department.code);
            form.setValue("name", department.name);
            form.setValue("nameInEnglish", department.nameInEnglish);
            form.setValue("isSuspended", department.isSuspended);
            form.setValue("departmentTypeId", department.departmentType.id);

            setIsFormEnabled(true);
            setIsEditingDepartment(true);
        }
    }, [department]);

    const resetFormValues = () => {
        form.resetField("id");
        form.resetField("code");
        form.resetField("name");
        form.resetField("nameInEnglish");
        form.resetField("departmentTypeId");
        form.resetField("isSuspended");
    };

    const { mutateAsync: createDepartment } = useMutationCreateDepartment();
    const { mutateAsync: updateDepartment } = useMutationUpdateDepartment();

    const departmentGrid = useAgGrid({});

    const handleAddNewDepartment = async (data: DepartmentFormValues) => {
        await createDepartment(data);

        resetFormValues();
        setIsFormEnabled(false);
        setIsAddingNewDepartment(false);
        departmentGrid.gridApi.deselectAll();
    };

    const handleSaveDepartment = async (data: DepartmentFormValues) => {
        await updateDepartment(data);

        resetFormValues();
        setIsFormEnabled(false);
        setIsEditingDepartment(false);
        setSelectedDepartmentId(null);
        departmentGrid.gridApi.deselectAll();
    };

    return (
        <>
            <DynamicForm form={form}>
                <Grid container spacing={2} alignItems={"center"} my={2}>
                    <Grid size={8}>
                        <FormItem
                            render="data-grid"
                            name="departmentName"
                            label={t(i18n.translationKey.department)}
                            placeholder={t(i18n.translationKey.departmentName)}
                            columnDefs={[
                                {
                                    field: "code",
                                    headerName: t(i18n.translationKey.departmentCode),
                                },
                                {
                                    field: "name",
                                    headerName: t(i18n.translationKey.departmentName),
                                },
                                {
                                    field: "isSuspended",
                                    headerName: t(i18n.translationKey.suspend),
                                    cellStyle: () => ({
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }),
                                },
                            ]}
                            rowData={listDepartments}
                            onRowSelected={handleSelectDepartment}
                            displayField="name"
                            valueField="id"
                            pagination
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                            {...departmentGrid}
                        />
                    </Grid>
                    <Grid size={4} container spacing={2} direction={"column"}>
                        <ActionButton
                            label={t(i18n.translationKey.addNew)}
                            startIcon={<AddCircle />}
                            size="small"
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                                resetFormValues();

                                setIsFormEnabled(true);
                                setIsAddingNewDepartment(true);
                                setIsEditingDepartment(false);
                            }}
                            sx={{
                                borderRadius: 4,
                                px: 2,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} mt={2} border={1} p={2} borderColor={"primary.main"} borderRadius={2}>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="text-input"
                            name="code"
                            label={t(i18n.translationKey.departmentCode)}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="text-input"
                            name="name"
                            label={t(i18n.translationKey.departmentName)}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="text-input"
                            name="nameInEnglish"
                            label={t(i18n.translationKey.departmentNameInEnglish)}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="select"
                            name="departmentTypeId"
                            label={t(i18n.translationKey.departmentType)}
                            options={listDepartmentTypes.map((type) => ({
                                label: reactI18n.language === I18N_LANGUAGE.VIETNAMESE ? type.name : type.nameInEnglish,
                                value: type.id,
                            }))}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            disabled
                            render="date-time-picker"
                            name="lastUpdatedAt"
                            label={t(i18n.translationKey.lastUpdatedAt)}
                        />
                    </Grid>
                    <Grid size={4} justifyContent={"center"} container>
                        <FormItem
                            disabled={!isFormEnabled}
                            render="checkbox"
                            name="isSuspended"
                            label={t(i18n.translationKey.suspend)}
                        />
                    </Grid>
                    <Grid size={12} justifyContent={"center"} container>
                        <ActionButton
                            hidden={!isFormEnabled || !isAddingNewDepartment}
                            label={t(i18n.translationKey.addNew)}
                            size="small"
                            variant="outlined"
                            fullWidth
                            onClick={form.handleSubmit(handleAddNewDepartment)}
                            sx={{
                                borderRadius: 4,
                                px: 2,
                            }}
                        />
                        <ActionButton
                            hidden={!isFormEnabled || !isEditingDepartment}
                            label={t(i18n.translationKey.save)}
                            startIcon={<Save />}
                            size="small"
                            variant="outlined"
                            fullWidth
                            onClick={form.handleSubmit(handleSaveDepartment)}
                            sx={{
                                borderRadius: 4,
                                px: 2,
                            }}
                        />
                    </Grid>
                </Grid>
            </DynamicForm>
        </>
    );
};

export default DepartmentMangement;
