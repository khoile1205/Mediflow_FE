import { FormControlLabel, FormGroup, Switch, SwitchProps } from "@mui/material";
import React from "react";
import { ControllerWrapper } from "../common";
import FormErrorMessage from "../common/error";
import { BaseFormItemProps } from "../types/form-item";

export type SwitchFormItemProps = Omit<BaseFormItemProps, "defaultValue"> & {
    defaultValue?: boolean;
    switchProps?: SwitchProps;
};

export const SwitchFormItem: React.FC<SwitchFormItemProps> = ({
    name,
    label = "",
    defaultValue = false,
    required = false,
    disabled,
    switchProps,
}) => {
    return (
        <ControllerWrapper
            name={name}
            defaultValue={defaultValue}
            required={required}
            render={({ field, error }) => {
                return (
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={field.value}
                                    onChange={(_, checked) => {
                                        if (!switchProps?.readOnly) {
                                            field.onChange(checked);
                                        }
                                    }}
                                    disabled={disabled}
                                    {...switchProps}
                                />
                            }
                            label={label}
                        />
                        <FormErrorMessage errorMessage={error} label={label} />
                    </FormGroup>
                );
            }}
        />
    );
};
