import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
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
    label = "",
    pattern,
    options,
    size = "small",
    ...props
}) => {
    const labelId = React.useMemo(() => {
        return name + "select_label";
    }, [name]);

    return (
        <ControllerWrapper
            name={name}
            required={required}
            pattern={pattern}
            defaultValue={defaultValue}
            render={({ field, error }) => (
                <FormControl fullWidth margin="normal" size={size} error={!!error} required={required}>
                    <InputLabel id={labelId}>{label}</InputLabel>
                    <Select size={size} labelId={labelId} label={label} {...field} {...props}>
                        {options.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormErrorMessage errorMessage={error} label={label} />
                </FormControl>
            )}
        />
    );
};
