import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { BaseDatePickerFormItem, BaseDatePickerFormItemProps } from "./base-date-picker";

export type DateTimePickerFormItemProps = Omit<BaseDatePickerFormItemProps, "mode">;

export const DateTimePickerFormItem: React.FC<DateTimePickerFormItemProps> = ({ datePickerProps, ...props }) => {
    return (
        <BaseDatePickerFormItem
            {...props}
            mode="datetime"
            datePickerProps={{
                dateFormat: DATE_TIME_FORMAT["dd/MM/yyyy HH:mm:ss"],
                timeFormat: "HH:mm",
                timeIntervals: 15,
                ...datePickerProps,
            }}
        />
    );
};
