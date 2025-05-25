import { CalendarMonth, Close } from "@mui/icons-material";
import { Box, FormControl, FormControlProps, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import DatePickerContainer from "../../../libs/date-picker/date-picker.container";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationMaxDate, TValidationMinDate, TValidationRequired } from "../types/validation";

type DateTimePickerValidationRules = TValidationRequired & TValidationMinDate & TValidationMaxDate;

type DateTimePickerUIProps = {
    defaultValue?: Date | string;
    size?: FormControlProps["size"];
};

export type DateTimePickerFormItemProps = Omit<BaseFormItemProps, "defaultValue"> &
    DateTimePickerValidationRules &
    DateTimePickerUIProps;

export const DateTimePickerFormItem: React.FC<DateTimePickerFormItemProps> = ({
    name,
    placeholder = "Chọn ngày",
    fullWidth = true,
    label = "",
    defaultValue = new Date(),
    disabled,
    size = "small",
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
                    <FormControl fullWidth={fullWidth} margin="normal" size={size}>
                        <Box className="relative">
                            <DatePickerContainer className="w-full">
                                <DatePicker
                                    showTimeSelect
                                    timeIntervals={15}
                                    timeFormat="HH:mm"
                                    selected={dateValue}
                                    onChange={(date: Date | null) => onChange(date)}
                                    onClickOutside={() => setOpen(false)}
                                    onCalendarOpen={() => setOpen(true)}
                                    onCalendarClose={() => setOpen(false)}
                                    showIcon={false}
                                    open={open}
                                    dateFormat={DATE_TIME_FORMAT["dd/MM/yyyy HH:mm:ss"]}
                                    minDate={validationProps.minDate}
                                    maxDate={validationProps.maxDate}
                                    popperPlacement="bottom-end"
                                    disabled={disabled}
                                    customInput={
                                        <TextField
                                            inputRef={ref}
                                            className="w-full"
                                            size={size}
                                            error={!!fieldState.error}
                                            required={validationProps.required}
                                            disabled={disabled}
                                            label={label ? `${label} ${validationProps.required ? "*" : ""}` : ""}
                                            placeholder={placeholder}
                                            variant="outlined"
                                            slotProps={{
                                                root: {
                                                    className: "w-full",
                                                },
                                                input: {
                                                    readOnly: true,
                                                    disabled,
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
                                                                {dateValue ? (
                                                                    <Close onClick={handleClearDate} />
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
                            </DatePickerContainer>
                            <FormErrorMessage errorMessage={error} />
                        </Box>
                    </FormControl>
                );
            }}
        />
    );
};
