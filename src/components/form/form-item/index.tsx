import { Stack } from "@mui/material";
import { FormLabel } from "../common";
import { FormItemProps } from "../types/form-item";
import { CheckboxFormItem } from "./checkbox";
import { DatePickerFormItem } from "./date-picker";
import { DateRangePickerFormItem } from "./date-range-picker";
import { InputNumberFormItem } from "./input-number";
import { RadioGroupFormItem } from "./radio-group";
import { SelectFieldFormItem } from "./select";
import { AgGridDropdownFormItem } from "./select-data-grid";
import { SwitchFormItem } from "./switch";
import { TextAreaFormItem } from "./text-area";
import { TextFieldFormItem } from "./text-field";

const FormItem: React.FC<FormItemProps> = (props) => {
    const renderLabel = props.label ? <FormLabel required={props.required} label={props.label} /> : null;

    const getFormComponent = () => {
        switch (props.render) {
            case "text-input":
                return <TextFieldFormItem {...props} />;
            case "select":
                return <SelectFieldFormItem {...props} />;
            case "data-grid":
                return <AgGridDropdownFormItem {...props} />;
            case "checkbox":
                return <CheckboxFormItem {...props} />;
            case "date-picker":
                return <DatePickerFormItem {...props} />;
            case "switch":
                return <SwitchFormItem {...props} />;
            case "radio-group":
                return <RadioGroupFormItem {...props} />;
            case "text-area":
                return <TextAreaFormItem {...props} />;
            case "input-number":
                return <InputNumberFormItem {...props} />;
            case "date-range-picker":
                return <DateRangePickerFormItem {...props} />;
            default:
                return null;
        }
    };

    return (
        <Stack direction={"row"} spacing={2} alignItems={"start"} className="mb-2">
            {renderLabel}
            {getFormComponent()}
        </Stack>
    );
};

export default FormItem;
