import React from "react";
import {
    Controller,
    ControllerFieldState,
    ControllerRenderProps,
    FieldPathValue,
    FieldValues,
    Path,
    useFormContext,
    UseFormStateReturn,
} from "react-hook-form";
import { TValidationRules } from "../types/validation";
import { mapValidationRules } from "../utils";
import { useTranslation } from "react-i18next";

type ControllerFormItemRenderProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
    error: string | undefined;
};

type ControllerWrapperProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = TValidationRules & {
    name: TName;
    render: (props: ControllerFormItemRenderProps<TFieldValues, TName>) => React.ReactElement;
    defaultValue?: FieldPathValue<TFieldValues, TName>;
} & {
    label?: string;
};

const ControllerWrapper = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
    name,
    defaultValue,
    render,
    ...validationProps
}: ControllerWrapperProps<TFieldValues, TName>) => {
    const { control, formState } = useFormContext<TFieldValues>();

    const { i18n, t } = useTranslation();

    // Recompute validation rules when language changes
    const rules = React.useMemo(() => {
        return mapValidationRules<TFieldValues, TName>({ ...validationProps }, t);
    }, [i18n.language, validationProps]);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field, fieldState }) => {
                const error = fieldState.error?.message;
                return render({ field, fieldState, formState, error });
            }}
        />
    );
};

export default ControllerWrapper;
