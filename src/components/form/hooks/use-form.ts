import { FieldValues, UseFormProps, UseFormReturn, useForm as useRhfForm } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TContext = any;

export const useForm = <T extends FieldValues = FieldValues>(
    props: UseFormProps<T, TContext> = {},
): UseFormReturn<T, TContext> => {
    return useRhfForm<T>({ reValidateMode: "onChange", mode: "onChange", ...props });
};
