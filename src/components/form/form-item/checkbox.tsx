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

type CheckboxUIProps = {
    direction?: "horizontal" | "vertical";
    options: CheckboxOption[];
    checkboxProps?: CheckboxProps;
    defaultValue?: string[];
};

type CheckboxValidationRules = TValidationRequired;

export type CheckboxFormItemProps = Omit<BaseFormItemProps, "defaultValue"> & CheckboxUIProps & CheckboxValidationRules;

export const CheckboxFormItem: React.FC<CheckboxFormItemProps> = ({
    name,
    required = false,
    options,
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
                        <FormErrorMessage errorMessage={error} />
                    </FormGroup>
                );
            }}
        />
        // <Controller
        //     name={name}
        //     control={control}
        //     defaultValue={defaultValue}
        //     rules={rules}

        // />
    );
};
