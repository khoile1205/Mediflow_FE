import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import {
    TValidationEmail,
    TValidationMaxLength,
    TValidationMinLength,
    TValidationPassword,
    TValidationPattern,
} from "../types/validation";

type TextFieldUIProps = {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
};

type TextFieldValidationRules = TValidationMinLength &
    TValidationMaxLength &
    TValidationPattern &
    TValidationEmail &
    TValidationPassword;

export type TextFieldFormItemProps = BaseFormItemProps &
    TextFieldUIProps &
    TextFieldValidationRules &
    Omit<TextFieldProps, keyof TextFieldUIProps>;

const getAdornmentProps = ({
    isPassword,
    showPassword,
    onTogglePassword,
    startAdornment,
    endAdornment,
}: {
    isPassword: boolean;
    showPassword: boolean;
    onTogglePassword: () => void;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}) => {
    const start = startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : undefined;

    const end = endAdornment ? (
        <InputAdornment position="end">{endAdornment}</InputAdornment>
    ) : isPassword ? (
        <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onClick={onTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    ) : undefined;

    return { startAdornment: start, endAdornment: end };
};

export const TextFieldFormItem: React.FC<TextFieldFormItemProps> = ({
    name,
    defaultValue,
    disabled,
    placeholder,
    label = "",
    size = "small",
    startAdornment = undefined,
    endAdornment = undefined,
    isEmail = false,
    maxLength = undefined,
    minLength = 0,
    pattern = undefined,
    isPassword = false,
    required = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((show) => !show);
    };

    return (
        <ControllerWrapper
            name={name}
            isEmail={isEmail}
            maxLength={maxLength}
            isPassword={isPassword}
            minLength={minLength}
            pattern={pattern}
            required={required}
            defaultValue={defaultValue ?? ""}
            render={({ field, error }) => (
                <Box>
                    <TextField
                        {...field}
                        placeholder={placeholder}
                        fullWidth
                        type={isPassword && !showPassword ? "password" : "text"}
                        error={!!error}
                        variant="outlined"
                        disabled={disabled}
                        sx={{
                            marginTop: 0,
                        }}
                        size={size}
                        margin="normal"
                        slotProps={{
                            input: getAdornmentProps({
                                isPassword,
                                showPassword,
                                onTogglePassword: handleTogglePasswordVisibility,
                                startAdornment,
                                endAdornment,
                            }),
                        }}
                        label={""}
                        {...props}
                    />
                    <FormErrorMessage errorMessage={error} />
                </Box>
            )}
        />
    );
};
