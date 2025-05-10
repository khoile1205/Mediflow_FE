import { CalendarMonth, Close } from "@mui/icons-material";
import { Box, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerContainer from "../../../libs/date-picker/date-picker.container";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationMaxDate, TValidationMinDate, TValidationRequired } from "../types/validation";

type DatePickerValidationRules = TValidationRequired & TValidationMinDate & TValidationMaxDate;

export type DatePickerFormItemProps = BaseFormItemProps & DatePickerValidationRules;

export const DatePickerFormItem: React.FC<DatePickerFormItemProps> = ({
    name,
    placeholder = "Chọn ngày",
    defaultValue = new Date(),
    disabled,
    ...validationProps
}) => {
    const [open, setOpen] = useState(false);

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
                    <Box className="relative">
                        <DatePickerContainer className="w-full">
                            <DatePicker
                                selected={dateValue}
                                onChange={(date: Date | null) => onChange(date)}
                                onClickOutside={() => setOpen(false)}
                                onCalendarOpen={() => setOpen(true)}
                                onCalendarClose={() => setOpen(false)}
                                showIcon={false}
                                open={open}
                                dateFormat="dd/MM/yyyy"
                                minDate={validationProps.minDate}
                                maxDate={validationProps.maxDate}
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
                                        variant="outlined"
                                        placeholder={placeholder}
                                        slotProps={{
                                            root: {
                                                className: "w-full",
                                            },
                                            input: {
                                                readOnly: true,
                                                sx: {
                                                    width: "100%",
                                                },
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {dateValue ? (
                                                            <Close
                                                                className="text-[black] cursor-pointer ml-3"
                                                                onClick={handleClearDate}
                                                            />
                                                        ) : (
                                                            <CalendarMonth />
                                                        )}
                                                    </InputAdornment>
                                                ),
                                                onClick: () => setOpen(true),
                                            },
                                        }}
                                    />
                                }
                            />
                        </DatePickerContainer>
                        <FormErrorMessage errorMessage={error} />
                    </Box>
                );
            }}
        />
    );
};
