import { AddCircle, Delete, Recycling, Save } from "@mui/icons-material";
import { Dialog, Grid, Stack } from "@mui/material";
import { RowSelectedEvent } from "node_modules/ag-grid-community/dist/types/src/events";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "~/components/common/action-button";
import { useAgGrid } from "~/components/common/ag-grid";
import DynamicForm from "~/components/form/dynamic-form";
import FormItem from "~/components/form/form-item";
import { PHONE_NUMBER_PATTERN } from "~/components/form/validation/pattern";
import i18n from "~/configs/i18n";
import { I18N_LANGUAGE } from "~/configs/i18n/types";
import { Staff } from "~/entities";
import { usePagination } from "~/hooks";
import { useQueryDepartmentsWithPagination } from "~/services/management/department/hooks/queries";
import {
    useMutationCreateUser,
    useMutationDeleteUser,
    useMutationResetPassword,
    useMutationUpdateUser,
} from "~/services/management/user/hooks/mutation";
import {
    useQueryRoleNames,
    useQueryUserById,
    useQueryUsersWithPagination,
} from "~/services/management/user/hooks/queries";
import { useStaffForm } from "./hooks";
import { StaffFormValues } from "./types";

export const UserManagement: React.FC = () => {
    const { t, i18n: reactI18n } = useTranslation();

    const [isFormEnabled, setIsFormEnabled] = useState(false);
    const [isAddingNewUser, setIsAddingNewUser] = useState(false);
    const [isEditingUser, setIsEditingUser] = useState(false);

    const [, setSelectedRoleName] = useState<string>(null);
    const [, setSelectedDepartmentId] = useState<number>(null);

    const { handlePageChange, pageIndex, pageSize } = usePagination();

    const {
        data: { listUsers, totalItems },
    } = useQueryUsersWithPagination({
        pageIndex,
        pageSize,
    });

    const {
        data: { roleNames },
    } = useQueryRoleNames();

    const {
        data: { listDepartments },
    } = useQueryDepartmentsWithPagination({
        pageIndex: 1,
        pageSize: 999,
    });

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const {
        data: { user },
    } = useQueryUserById(selectedUserId);

    const userGrid = useAgGrid({});

    const form = useStaffForm();

    useEffect(() => {
        if (user) {
            form.reset();
            form.setValue("id", user.id);
            form.setValue("code", user.code);
            form.setValue("name", user.name);
            form.setValue("userName", user.userName);
            form.setValue("email", user.email);
            form.setValue("phoneNumber", user.phoneNumber);
            form.setValue("address", user.address);
            form.setValue("profilePictureUrl", user.profilePictureUrl);
            form.setValue("roleName", user.roles[0]);
            form.setValue("roleNames", user.roles);
            form.setValue("departmentId", user.departments[0].id);
            form.setValue(
                "departmentIds",
                user.departments.map((dept) => dept.id),
            );
            form.setValue("address", user.address);
            form.setValue("profilePictureUrl", user.profilePictureUrl);
            form.setValue("isSuspended", user.isSuspended);
            setIsFormEnabled(true);
            setIsEditingUser(true);

            setSelectedRoleName(user.roles[0]);
            setSelectedDepartmentId(user.departments[0].id);
        }
    }, [user]);

    const resetFormValues = () => {
        form.reset();
    };

    const handleSelectUser = (selectedRow: RowSelectedEvent<Staff>) => {
        if (!selectedRow) {
            form.reset();
            setIsFormEnabled(false);
            return;
        }

        setSelectedUserId(selectedRow.data.id);
        setIsAddingNewUser(false);
    };

    const { mutateAsync: createUser } = useMutationCreateUser();
    const { mutateAsync: updateUser } = useMutationUpdateUser();
    const { mutateAsync: deleteUser } = useMutationDeleteUser();
    const { mutateAsync: resetPassword } = useMutationResetPassword();

    const prepareUserData = (data: StaffFormValues) => {
        const { roleName, departmentId, ...rest } = data;

        return {
            ...rest,
            roleNames: [roleName],
            departmentIds: [departmentId],
        };
    };
    const handleAddNewUser = async (data: StaffFormValues) => {
        const userData = prepareUserData(data);
        await createUser(userData);

        resetFormValues();
        setIsFormEnabled(false);
        setIsAddingNewUser(false);
        userGrid.gridApi.deselectAll();
    };

    const handleSaveUser = async (data: StaffFormValues) => {
        const userData = prepareUserData(data);
        await updateUser(userData);

        resetFormValues();
        setIsFormEnabled(false);
        setIsEditingUser(false);
        setSelectedUserId(null);
        userGrid.gridApi.deselectAll();
    };

    const handleDeleteUser = async (data: StaffFormValues) => {
        await deleteUser(data.id!);

        resetFormValues();
        setIsFormEnabled(false);
        setIsEditingUser(false);
        setSelectedUserId(null);
        userGrid.gridApi.deselectAll();
    };

    const handleResetPassword = async (data: StaffFormValues) => {
        await resetPassword(data.email);
    };

    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<"reset" | "delete" | null>(null);

    const handleConfirmDialog = async () => {
        const data = form.getValues();
        if (dialogType === "delete") {
            handleDeleteUser(data);
        } else if (dialogType === "reset") {
            handleResetPassword(data);
        }

        setIsOpenDialog(false);
        setDialogType(null);
    };

    return (
        <>
            <DynamicForm form={form}>
                <Grid container spacing={2} my={2}>
                    <Grid size={8}>
                        <FormItem
                            render="data-grid"
                            name="id"
                            label={t(i18n.translationKey.user)}
                            placeholder={t(i18n.translationKey.fullName)}
                            columnDefs={[
                                {
                                    field: "code",
                                    headerName: t(i18n.translationKey.userCode),
                                },
                                {
                                    field: "name",
                                    headerName: t(i18n.translationKey.userName),
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
                            rowData={listUsers}
                            onRowSelected={handleSelectUser}
                            displayField="name"
                            pagination
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                            {...userGrid}
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
                                setIsAddingNewUser(true);
                                setIsEditingUser(false);
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
                            label={t(i18n.translationKey.userCode)}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="text-input"
                            name="userName"
                            label={t(i18n.translationKey.userName)}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="text-input"
                            name="email"
                            label={t(i18n.translationKey.email)}
                            isEmail
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="text-input"
                            name="name"
                            label={t(i18n.translationKey.fullName)}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="text-input"
                            name="phoneNumber"
                            pattern={PHONE_NUMBER_PATTERN}
                            label={t(i18n.translationKey.phoneNumber)}
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
                    <Grid size={8}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="text-input"
                            name="address"
                            label={t(i18n.translationKey.address)}
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
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="select"
                            name="roleName"
                            label={t(i18n.translationKey.userRole)}
                            options={roleNames.map((role) => ({
                                label: role.toCase("readable"),
                                value: role,
                            }))}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormItem
                            required
                            disabled={!isFormEnabled}
                            render="select"
                            name="departmentId"
                            label={t(i18n.translationKey.department)}
                            options={listDepartments.map((dept) => ({
                                label: reactI18n.language === I18N_LANGUAGE.VIETNAMESE ? dept.name : dept.nameInEnglish,
                                value: dept.id,
                            }))}
                        />
                    </Grid>
                    <Grid size={4} justifyContent={"center"} container>
                        <ActionButton
                            hidden={!isFormEnabled || !isAddingNewUser}
                            label={t(i18n.translationKey.addNew)}
                            size="small"
                            variant="outlined"
                            fullWidth
                            onClick={form.handleSubmit(handleAddNewUser)}
                            sx={{
                                borderRadius: 4,
                                px: 2,
                            }}
                        />
                        <ActionButton
                            hidden={!isFormEnabled || !isEditingUser}
                            label={t(i18n.translationKey.save)}
                            startIcon={<Save />}
                            size="small"
                            variant="outlined"
                            fullWidth
                            onClick={form.handleSubmit(handleSaveUser)}
                            sx={{
                                borderRadius: 4,
                                px: 2,
                            }}
                        />
                    </Grid>
                    <Grid size={4} hidden={!isAddingNewUser}>
                        <FormItem
                            render="text-input"
                            disabled={!isFormEnabled}
                            name="password"
                            label={t(i18n.translationKey.password)}
                            isPassword
                            required={isAddingNewUser}
                        />
                    </Grid>
                    <Grid size={4} hidden={!isAddingNewUser}>
                        <FormItem
                            render="text-input"
                            disabled={!isFormEnabled}
                            name="confirmPassword"
                            label={t(i18n.translationKey.confirmPassword)}
                            isPassword
                            required={isAddingNewUser}
                        />
                    </Grid>
                </Grid>
                <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                    <ActionButton
                        label={t(i18n.translationKey.resetPassword)}
                        startIcon={<Recycling />}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                            setDialogType("reset");
                            setIsOpenDialog(true);
                        }}
                        sx={{
                            borderRadius: 4,
                            px: 2,
                        }}
                        className="bg-yellow-700 text-white"
                        hidden={!isEditingUser}
                    />
                    <ActionButton
                        label={t(i18n.translationKey.delete)}
                        startIcon={<Delete />}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                            setDialogType("delete");
                            setIsOpenDialog(true);
                        }}
                        sx={{
                            borderRadius: 4,
                            px: 2,
                        }}
                        className="bg-red-700 text-white"
                        hidden={!isEditingUser}
                    />
                </Stack>
            </DynamicForm>

            <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
                <div className="max-w-sm rounded-xl bg-white p-6 shadow-xl">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {dialogType === "delete"
                            ? t(i18n.translationKey.confirmDeleteUser)
                            : t(i18n.translationKey.confirmResetPassword)}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {dialogType === "delete"
                            ? t(i18n.translationKey.confirmDeleteUserMessage)
                            : t(i18n.translationKey.confirmResetPasswordMessage)}
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                        <ActionButton
                            label={t(i18n.translationKey.cancel)}
                            onClick={() => setIsOpenDialog(false)}
                            variant="outlined"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        />
                        <ActionButton
                            label={t(i18n.translationKey.confirm)}
                            onClick={handleConfirmDialog}
                            className={
                                dialogType === "delete"
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                            }
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default UserManagement;
