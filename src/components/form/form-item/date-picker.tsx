import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { BaseDatePickerFormItem, BaseDatePickerFormItemProps } from "./base-date-picker";

export type DatePickerFormItemProps = Omit<BaseDatePickerFormItemProps, "mode">;

export const DatePickerFormItem: React.FC<DatePickerFormItemProps> = ({ ...props }) => {
    return (
        <BaseDatePickerFormItem
            mode="date"
            datePickerProps={{
                dateFormat: DATE_TIME_FORMAT["dd/MM/yyyy"],
                showTimeSelect: false,
            }}
            {...props}
        />
    );
};
