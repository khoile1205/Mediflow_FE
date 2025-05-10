import { Box, TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationMaxLength, TValidationMinLength, TValidationPattern } from "../types/validation";
import { mapValidationRules } from "../utils";
import FormErrorMessage from "../common/error";

type TextAreaUIProps = TextFieldProps & {
    rows?: number;
    maxRows?: number;
};

type TextAreaValidationRules = TValidationMinLength & TValidationMaxLength & TValidationPattern;

export type TextAreaFormItemProps = BaseFormItemProps & TextAreaUIProps & TextAreaValidationRules;

export const TextAreaFormItem: React.FC<TextAreaFormItemProps> = ({
    name,
    defaultValue,
    disabled,
    placeholder,
    label = "",
    maxLength,
    minLength = 0,
    pattern,
    required = false,
    rows = 4,
    maxRows = 4,
    ...props
}) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const rules = mapValidationRules({
        maxLength,
        minLength,
        pattern,
        required,
    });
    const error = errors[name]?.message as string | undefined;

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue ?? ""}
            rules={rules}
            render={({ field }) => (
                <Box style={{ width: "100%" }}>
                    <TextField
                        {...field}
                        label={null}
                        placeholder={placeholder}
                        fullWidth
                        multiline
                        rows={rows}
                        maxRows={maxRows}
                        error={!!error}
                        helperText={error}
                        variant="outlined"
                        disabled={disabled}
                        margin="normal"
                        {...props}
                    />
                    <FormErrorMessage errorMessage={error} />
                </Box>
            )}
        />
    );
};
