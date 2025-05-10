import { FormControlLabel, FormGroup, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { ControllerWrapper } from "../common";
import FormErrorMessage from "../common/error";
import { BaseFormItemProps } from "../types/form-item";

type RadioGroupOption = {
    label?: string;
    value: string;
};

type RadioGroupUIProps = {
    direction?: "horizontal" | "vertical";
    options: RadioGroupOption[];
};

export type RadioGroupFormItemProps = BaseFormItemProps & RadioGroupUIProps;

export const RadioGroupFormItem: React.FC<RadioGroupFormItemProps> = ({
    name,
    required = false,
    defaultValue = "",
    disabled,
    direction = "horizontal",
    options,
}) => {
    return (
        <ControllerWrapper
            name={name}
            required={required}
            defaultValue={defaultValue}
            render={({ field, error }) => {
                return (
                    <FormGroup>
                        <RadioGroup value={field.value} onChange={field.onChange} row={direction === "horizontal"}>
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio disabled={disabled} />}
                                    label={option.label}
                                />
                            ))}
                        </RadioGroup>
                        <FormErrorMessage errorMessage={error} />
                    </FormGroup>
                );
            }}
        />
    );
};
