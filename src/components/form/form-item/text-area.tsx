import { Box, TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { ControllerWrapper } from "../common";
import FormErrorMessage from "../common/error";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationMaxLength, TValidationMinLength, TValidationPattern } from "../types/validation";

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
    fullWidth = true,
    rows = 4,
    maxRows = 4,
    ...props
}) => {
    return (
        <ControllerWrapper
            name={name}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            required={required}
            defaultValue={defaultValue ?? ""}
            render={({ field, error }) => (
                <Box className="w-full">
                    <TextField
                        {...field}
                        label={label || placeholder}
                        required={required}
                        placeholder={placeholder}
                        fullWidth={fullWidth}
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
                    <FormErrorMessage errorMessage={error} label={label} />
                </Box>
            )}
        />
    );
};
