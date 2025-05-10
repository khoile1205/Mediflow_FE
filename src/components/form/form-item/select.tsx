import { FormControl, MenuItem, Select, SelectProps } from "@mui/material";
import React from "react";
import { ControllerWrapper } from "../common";
import FormErrorMessage from "../common/error";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationPattern } from "../types/validation";

type SelectFieldValidationRules = TValidationPattern;

export type SelectFieldFormItemProps = BaseFormItemProps &
    SelectFieldValidationRules &
    SelectProps & {
        options: { value: string | number; label: string }[];
    };

export const SelectFieldFormItem: React.FC<SelectFieldFormItemProps> = ({
    name,
    defaultValue = "",
    required = false,
    pattern,
    options,
    ...props
}) => {
    return (
        <>
            <ControllerWrapper
                name={name}
                required={required}
                pattern={pattern}
                defaultValue={defaultValue}
                render={({ field, error }) => (
                    <FormControl fullWidth margin="normal" error={!!error}>
                        <Select {...field} {...props}>
                            {options.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormErrorMessage errorMessage={error} />
                    </FormControl>
                )}
            />
        </>
    );
};
