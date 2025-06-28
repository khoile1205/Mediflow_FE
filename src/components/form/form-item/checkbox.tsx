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
            render={({ field, error }) => (
                <FormControl error={!!error} disabled={disabled} fullWidth={fullWidth}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                {...checkboxProps}
                            />
                        }
                        label={label}
                    />
                    <FormErrorMessage errorMessage={error} label={label} />
                </FormControl>
            )}
        />
    );
};
