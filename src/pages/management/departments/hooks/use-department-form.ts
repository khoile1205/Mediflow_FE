import { useForm } from "~/components/form/hooks/use-form";
import { DepartmentFormValues } from "../types";

export const useDepartmentForm = () => {
    const departmentForm = useForm<DepartmentFormValues>({
        defaultValues: {
            id: null,
            code: "",
            name: "",
            nameInEnglish: "",
            departmentTypeId: 1,
            isSuspended: false,
            isCancelled: false,
        },
    });

    return departmentForm;
};
