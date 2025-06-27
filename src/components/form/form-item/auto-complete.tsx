import { Autocomplete, FormControl, TextField } from "@mui/material";
import React from "react";
import { ControllerWrapper } from "../common";
import FormErrorMessage from "../common/error";
import { BaseFormItemProps, BaseOption } from "../types/form-item";

export type AutocompleteFieldFormItemProps = BaseFormItemProps & {
    options: BaseOption[];
    size?: "small" | "medium";
    placeholder?: string;
    onInputChange?: (event: React.SyntheticEvent<Element, Event>, value: string) => void;
} & Omit<React.ComponentProps<typeof Autocomplete<BaseOption, false, false, false>>, "options" | "renderInput">;

export const AutocompleteFieldFormItem: React.FC<AutocompleteFieldFormItemProps> = ({
    name,
    defaultValue = null,
    required = false,
    label = "",
    options,
    size = "small",
    placeholder = "",
    onInputChange,
    ...props
}) => {
    return (
        <ControllerWrapper
            name={name}
            required={required}
            defaultValue={defaultValue}
            render={({ field, error }) => {
                const selectedOption = options.find((option) => option.value === field.value) || null;

                return (
                    <FormControl fullWidth margin="normal" size={size} error={!!error} required={required}>
                        <Autocomplete<BaseOption, false, false, false>
                            options={options}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => {
                                if (!value) return false;
                                return option.value === value.value;
                            }}
                            value={selectedOption}
                            onChange={(_, newValue) => {
                                if (!props.readOnly) {
                                    field.onChange(newValue ? newValue.value : null);
                                }
                            }}
                            onInputChange={(event, value) => {
                                onInputChange?.(event, value);
                            }}
                            openOnFocus={!props.readOnly}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={label}
                                    placeholder={placeholder}
                                    error={!!error}
                                    size={size}
                                    required={required}
                                />
                            )}
                            {...props}
                        />
                        <FormErrorMessage errorMessage={error} />
                    </FormControl>
                );
            }}
        />
    );
};
