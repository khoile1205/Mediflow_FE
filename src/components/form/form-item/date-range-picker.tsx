import { CalendarMonth, Close } from "@mui/icons-material";
import { Box, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerContainer from "../../../libs/date-picker/date-picker.container";
import { ControllerWrapper, FormErrorMessage } from "../common";
import { BaseFormItemProps } from "../types/form-item";
import { TValidationMaxDate, TValidationMinDate } from "../types/validation";

type DateRangePickerValidationRules = TValidationMinDate & TValidationMaxDate;

export type DateRangePickerFormItemProps = Omit<BaseFormItemProps, "defaultValue"> &
    DateRangePickerValidationRules & {
        defaultValue?: { startDate?: Date; endDate?: Date };
    };

export const DateRangePickerFormItem: React.FC<DateRangePickerFormItemProps> = ({
    name,
    placeholder = "Chọn khoảng ngày",
    defaultValue = { startDate: null, endDate: null },
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
                    <Box className="relative">
                        <DatePickerContainer className="w-full">
                            <DatePicker
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
                                        value={formattedRange}
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
                                                        {startDate || endDate ? (
                                                            <Close
                                                                className="text-[black] cursor-pointer ml-3"
                                                                onClick={handleClear}
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
                            <FormErrorMessage errorMessage={error} />
                        </DatePickerContainer>
                    </Box>
                );
            }}
        />
        // <Controller
        //     name={name}
        //     control={control}
        //     rules={{
        //         ...rules,
        //         validate: (value) => {
        //             const { startDate, endDate } = value || {};
        //             if (startDate && endDate && endDate < startDate) {
        //                 return "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu";
        //             }
        //             return true;
        //         },
        //     }}
        //     defaultValue={defaultValue}
        //     render={({ field: { onChange, value = {}, ref }, fieldState }) => {
        //         const startDate = value.startDate ? new Date(value.startDate) : null;
        //         const endDate = value.endDate ? new Date(value.endDate) : null;

        //         const handleClearStart = () => onChange({ ...value, startDate: null });
        //         const handleClearEnd = () => onChange({ ...value, endDate: null });

        //         return (
        //             <Box className="flex gap-4 items-center">
        //                 <DatePickerContainer className="w-full">
        //                     <DatePicker
        //                         selected={startDate}
        //                         onChange={(date: Date | null) => onChange({ ...value, startDate: date })}
        //                         onClickOutside={() => setStartOpen(false)}
        //                         onCalendarOpen={() => setStartOpen(true)}
        //                         onCalendarClose={() => setStartOpen(false)}
        //                         showIcon={false}
        //                         open={startOpen}
        //                         dateFormat="dd/MM/yyyy"
        //                         minDate={minDate}
        //                         maxDate={maxDate}
        //                         placeholderText="Từ ngày"
        //                         popperPlacement="bottom-end"
        //                         disabled={disabled}
        //                         customInput={
        //                             <TextField
        //                                 inputRef={ref}
        //                                 className="w-full"
        //                                 error={!!fieldState.error}
        //                                 helperText={fieldState.error?.message}
        //                                 required={required}
        //                                 disabled={disabled}
        //                                 variant="outlined"
        //                                 placeholder="Từ ngày"
        //                                 slotProps={{
        //                                     input: {
        //                                         readOnly: true,
        //                                         endAdornment: (
        //                                             <InputAdornment position="end">
        //                                                 {startDate ? (
        //                                                     <Close
        //                                                         className="text-black cursor-pointer ml-3"
        //                                                         onClick={handleClearStart}
        //                                                     />
        //                                                 ) : (
        //                                                     <CalendarMonth />
        //                                                 )}
        //                                             </InputAdornment>
        //                                         ),
        //                                         onClick: () => setStartOpen(true),
        //                                     },
        //                                 }}
        //                             />
        //                         }
        //                     />
        //                 </DatePickerContainer>
        //                 {delimiter}
        //                 <DatePickerContainer className="w-full">
        //                     <DatePicker
        //                         selected={endDate}
        //                         onChange={(date: Date | null) => onChange({ ...value, endDate: date })}
        //                         onClickOutside={() => setEndOpen(false)}
        //                         onCalendarOpen={() => setEndOpen(true)}
        //                         onCalendarClose={() => setEndOpen(false)}
        //                         showIcon={false}
        //                         open={endOpen}
        //                         dateFormat="dd/MM/yyyy"
        //                         minDate={minDate}
        //                         maxDate={maxDate}
        //                         placeholderText="Đến ngày"
        //                         popperPlacement="bottom-end"
        //                         disabled={disabled}
        //                         customInput={
        //                             <TextField
        //                                 inputRef={ref}
        //                                 className="w-full"
        //                                 error={!!fieldState.error}
        //                                 helperText={fieldState.error?.message}
        //                                 required={required}
        //                                 disabled={disabled}
        //                                 variant="outlined"
        //                                 placeholder="Đến ngày"
        //                                 slotProps={{
        //                                     input: {
        //                                         readOnly: true,
        //                                         endAdornment: (
        //                                             <InputAdornment position="end">
        //                                                 {endDate ? (
        //                                                     <Close
        //                                                         className="text-black cursor-pointer ml-3"
        //                                                         onClick={handleClearEnd}
        //                                                     />
        //                                                 ) : (
        //                                                     <CalendarMonth />
        //                                                 )}
        //                                             </InputAdornment>
        //                                         ),
        //                                         onClick: () => setEndOpen(true),
        //                                     },
        //                                 }}
        //                             />
        //                         }
        //                     />
        //                 </DatePickerContainer>
        //             </Box>
        //         );
        //     }}
        // />
    );
};
