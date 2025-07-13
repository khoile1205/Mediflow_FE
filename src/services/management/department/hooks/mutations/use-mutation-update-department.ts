import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { departmentApis } from "../../infras";
import { DepartmentFormValues } from "~/pages/management/departments/types";

export function useMutationUpdateDepartment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.DEPARTMENT.UPDATE_DEPARTMENT],
        mutationFn: async (payload: DepartmentFormValues) => {
            const response = await departmentApis.updateDepartment(payload);
            return response;
        },
        onSuccess: (response, payload) => {
            if (response.StatusCode === 200) {
                queryClient.invalidateQueries({
                    queryKey: [QueryKey.DEPARTMENT.GET_LIST_DEPARTMENT_WITH_PAGINATION],
                });
                queryClient.invalidateQueries({
                    queryKey: [QueryKey.DEPARTMENT.GET_DEPARTMENT_BY_ID + payload.id],
                });
                showToast.success(i18n.t(i18n.translationKey.updateDepartmentSuccessfully));
                return;
            }
            showToast.error(i18n.t(i18n.translationKey.updateDepartmentFailed));
        },
    });
}
