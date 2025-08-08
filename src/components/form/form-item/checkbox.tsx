import { Checkbox, CheckboxProps, FormControl, FormControlLabel } from "@mui/material";
import React from "react";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationRequired } from "../types/validation";

type CheckboxValidationRules = TValidationRequired;

export type SingleCheckboxFormItemProps = Omit<BaseFormItemProps, "defaultValue"> &
    CheckboxValidationRules & {
        label?: string;
        defaultValue?: boolean;
        checkboxProps?: CheckboxProps;
    };

export const CheckboxFormItem: React.FC<SingleCheckboxFormItemProps> = ({
    name,
    required = false,
    label,
    defaultValue = false,
    disabled = false,
    fullWidth = true,
    checkboxProps,
}) => {
    return (
        <ControllerWrapper
            name={name}
            required={required}
            defaultValue={defaultValue}
            render={({ field, error }) => {
                return (
                    <FormControl error={!!error} disabled={disabled} fullWidth={fullWidth}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...checkboxProps}
                                    checked={field.value}
                                    onChange={(e, checked) => {
                                        field.onChange(e.target.checked);
                                        if (checkboxProps?.onChange) {
                                            checkboxProps.onChange(e, checked);
                                        }
                                    }}
                                />
                            }
                            label={label}
                        />
                        <FormErrorMessage errorMessage={error} label={label} />
                    </FormControl>
                );
            }}
        />
    );
};
