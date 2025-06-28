import { CalendarMonth, Close } from "@mui/icons-material";
import { Box, FormControl, FormControlProps, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerContainer from "../../../libs/date-picker/date-picker.container";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationMaxDate, TValidationMinDate } from "../types/validation";

type BaseDatePickerValidationRules = TValidationMinDate & TValidationMaxDate;

type BaseDatePickerUIProps = {
    defaultValue?: Date | string;
    size?: FormControlProps["size"];
    mode: "date" | "datetime";
    datePickerProps?: Omit<Partial<React.ComponentProps<typeof DatePicker>>, "onChange" | "selected">;
};

export type BaseDatePickerFormItemProps = Omit<BaseFormItemProps, "defaultValue"> &
    BaseDatePickerValidationRules &
    BaseDatePickerUIProps;

export const BaseDatePickerFormItem: React.FC<BaseDatePickerFormItemProps> = ({
    name,
    placeholder = "Chọn ngày",
    fullWidth = true,
    defaultValue = new Date(),
    label = "",
    disabled,
    size = "small",
    mode = "date",
    datePickerProps,
    ...validationProps
}) => {
    const [open, setOpen] = useState(false);

    const renderLabel = label ? `${label} ${validationProps.required ? "*" : ""}` : "";
    return (
        <ControllerWrapper
            name={name}
            {...validationProps}
            defaultValue={defaultValue}
            render={({ field: { onChange, value, ref }, fieldState, error }) => {
                const dateValue = value ? new Date(value) : null;

                const handleClearDate = () => {
                    onChange(null);
                    setOpen(false);
                };

                return (
                    <FormControl fullWidth={fullWidth} margin="normal" size={size}>
                        <Box className="relative">
                            <DatePickerContainer className="w-full">
                                <DatePicker
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="scroll"
                                    showTimeSelect={mode === "datetime"}
                                    timeIntervals={datePickerProps.timeIntervals}
                                    timeFormat="HH:mm"
                                    timeCaption="Thời gian"
                                    selected={dateValue}
                                    onChange={(date: Date | null) => onChange(date)}
                                    onClickOutside={() => setOpen(false)}
                                    onCalendarOpen={() => {
                                        if (!datePickerProps?.readOnly) setOpen(true);
                                    }}
                                    onCalendarClose={() => setOpen(false)}
                                    showIcon={false}
                                    open={!datePickerProps?.readOnly && open}
                                    dateFormat={datePickerProps.dateFormat}
                                    minDate={validationProps.minDate}
                                    maxDate={validationProps.maxDate}
                                    readOnly={datePickerProps.readOnly}
                                    placeholderText={placeholder}
                                    popperPlacement="bottom-end"
                                    disabled={disabled}
                                    customInput={
                                        <TextField
                                            inputRef={ref}
                                            className="w-full"
                                            error={!!fieldState.error}
                                            required={validationProps.required}
                                            disabled={disabled}
                                            size={size}
                                            variant="outlined"
                                            placeholder={placeholder}
                                            label={renderLabel}
                                            slotProps={{
                                                root: {
                                                    className: "w-full",
                                                },
                                                input: {
                                                    readOnly: true,
                                                    sx: {
                                                        width: "100%",
                                                    },
                                                    endAdornment: !datePickerProps.readOnly ? (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                disabled={disabled}
                                                                size="small"
                                                                className="ml-3"
                                                            >
                                                                {dateValue ? (
                                                                    <Close onClick={handleClearDate} />
                                                                ) : (
                                                                    <CalendarMonth />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ) : null,
                                                    onClick: () => {
                                                        if (datePickerProps.readOnly || disabled) {
                                                            return;
                                                        }
                                                        setOpen(true);
                                                    },
                                                },
                                            }}
                                        />
                                    }
                                />
                            </DatePickerContainer>
                            <FormErrorMessage errorMessage={error} label={label} />
                        </Box>
                    </FormControl>
                );
            }}
        />
    );
};
