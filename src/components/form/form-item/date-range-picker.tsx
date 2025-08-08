import { CalendarMonth, Close } from "@mui/icons-material";
import { Box, FormControl, FormControlProps, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerContainer from "~/libs/date-picker/date-picker.container";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationMaxDate, TValidationMinDate } from "../types/validation";

type DateRangePickerValidationRules = TValidationMinDate & TValidationMaxDate;

export type DateRangePickerFormItemProps = Omit<BaseFormItemProps, "defaultValue"> &
    DateRangePickerValidationRules & {
        defaultValue?: { startDate?: Date; endDate?: Date };
        size?: FormControlProps["size"];
    };

export const DateRangePickerFormItem: React.FC<DateRangePickerFormItemProps> = ({
    name,
    placeholder = "Chọn khoảng ngày",
    defaultValue = { startDate: null, endDate: null },
    disabled,
    label = "",
    fullWidth = true,
    size = "small",
    ...validationProps
}) => {
    const [open, setOpen] = useState(false);

    const renderLabel = label ? `${label}${validationProps.required ? " *" : ""}` : "";

    return (
        <ControllerWrapper
            name={name}
            {...validationProps}
            defaultValue={defaultValue}
            render={({ field: { onChange, value, ref }, fieldState, error }) => {
                const { startDate, endDate } = value || { startDate: null, endDate: null };

                const handleClear = () => {
                    onChange({ startDate: null, endDate: null });
                    setOpen(false);
                };

                const formattedRange =
                    startDate && endDate
                        ? `${new Date(startDate).toLocaleDateString()} ~ ${new Date(endDate).toLocaleDateString()}`
                        : "";

                return (
                    <FormControl fullWidth={fullWidth} margin="normal" size={size}>
                        <Box className="relative">
                            <DatePickerContainer className="w-full">
                                <DatePicker
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    selectsRange
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(dates: [Date | null, Date | null]) =>
                                        onChange({ startDate: dates[0], endDate: dates[1] })
                                    }
                                    onClickOutside={() => setOpen(false)}
                                    onCalendarOpen={() => setOpen(true)}
                                    onCalendarClose={() => setOpen(false)}
                                    showIcon={false}
                                    open={open}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={validationProps.minDate}
                                    maxDate={validationProps.maxDate}
                                    placeholderText={placeholder}
                                    disabled={disabled}
                                    popperPlacement="bottom-end"
                                    customInput={
                                        <TextField
                                            inputRef={ref}
                                            className="w-full"
                                            error={!!fieldState.error}
                                            required={validationProps.required}
                                            disabled={disabled}
                                            variant="outlined"
                                            placeholder={placeholder}
                                            label={renderLabel}
                                            value={formattedRange}
                                            size={size}
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
                                                            <IconButton
                                                                disabled={disabled}
                                                                size="small"
                                                                className="ml-3"
                                                            >
                                                                {startDate || endDate ? (
                                                                    <Close onClick={handleClear} />
                                                                ) : (
                                                                    <CalendarMonth />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    onClick: () => {
                                                        if (disabled) {
                                                            return;
                                                        }
                                                        setOpen(true);
                                                    },
                                                },
                                            }}
                                        />
                                    }
                                />
                                <FormErrorMessage errorMessage={error} label={label} />
                            </DatePickerContainer>
                        </Box>
                    </FormControl>
                );
            }}
        />
    );
};
