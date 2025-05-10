import React from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

interface Props<T extends FieldValues = FieldValues> extends React.PropsWithChildren {
    form: UseFormReturn<T>;
    direction?: "row" | "column";
    onSubmit?: (data: T) => void;
}

const DynamicForm = <T extends FieldValues = FieldValues>({ form, children, onSubmit }: Props<T>) => {
    const { handleSubmit } = form;

    const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSubmit) {
            handleSubmit(onSubmit)();
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmitForm}>{children}</form>
        </FormProvider>
    );
};

export default DynamicForm;
