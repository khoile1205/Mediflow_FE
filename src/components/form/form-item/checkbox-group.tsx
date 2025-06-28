import { Checkbox, CheckboxProps, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationRequired } from "../types/validation";
import { ControllerWrapper, FormErrorMessage } from "../common";

type CheckboxOption = {
    label?: string;
    value: string;
    disabled?: boolean;
};

type CheckboxGroupUIProps = {
    direction?: "horizontal" | "vertical";
    options: CheckboxOption[];
    checkboxProps?: CheckboxProps;
    defaultValue?: string[];
};

type CheckboxGroupValidationRules = TValidationRequired;

export type CheckboxGroupFormItemProps = Omit<BaseFormItemProps, "defaultValue"> &
    CheckboxGroupUIProps &
    CheckboxGroupValidationRules;

export const CheckboxGroupFormItem: React.FC<CheckboxGroupFormItemProps> = ({
    name,
    required = false,
    options,
    label = "",
    defaultValue = [],
    direction = "horizontal",
    checkboxProps,
}) => {
    return (
        <ControllerWrapper
            required={required}
            defaultValue={defaultValue}
            name={name}
            render={({ field, error }) => {
                const { value = [], onChange } = field;

                const handleChange = (optionValue: string) => {
                    const newValue = value.includes(optionValue)
                        ? value.filter((v: string) => v !== optionValue)
                        : [...value, optionValue];
                    onChange(newValue);
                };

                return (
                    <FormGroup row={direction === "horizontal"}>
                        {options.map(({ label, value: optionValue, disabled }) => (
                            <FormControlLabel
                                key={optionValue}
                                control={
                                    <Checkbox
                                        checked={value.includes(optionValue)}
                                        onChange={() => handleChange(optionValue)}
                                        disabled={disabled}
                                        {...checkboxProps}
                                    />
                                }
                                label={label}
                            />
                        ))}
                        <FormErrorMessage errorMessage={error} label={label} />
                    </FormGroup>
                );
            }}
        />
    );
};
