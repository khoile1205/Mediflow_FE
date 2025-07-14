import { useQueryClient, useMutation } from "@tanstack/react-query";
import i18n from "~/configs/i18n";
import { QueryKey } from "~/constants/query-key";
import { showToast } from "~/utils";
import { departmentApis } from "../../infras";
import { DepartmentFormValues } from "~/pages/management/departments/types";

export function useMutationCreateDepartment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.DEPARTMENT.CREATE_DEPARTMENT],
        mutationFn: async (payload: DepartmentFormValues) => {
            const response = await departmentApis.createDepartment(payload);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: [QueryKey.DEPARTMENT.GET_LIST_DEPARTMENT_WITH_PAGINATION],
            });
            showToast.success(i18n.t(i18n.translationKey.createDepartmentSuccessfully));
        },
        onError: () => {
            showToast.error(i18n.t(i18n.translationKey.createDepartmentFailed));
        },
    });
}
