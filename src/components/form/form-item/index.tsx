import { Stack } from "@mui/material";
import { FormItemProps } from "../types/form-item";
import { CheckboxFormItem } from "./checkbox";
import { CheckboxGroupFormItem } from "./checkbox-group";
import { DatePickerFormItem } from "./date-picker";
import { DateRangePickerFormItem } from "./date-range-picker";
import { DateTimePickerFormItem } from "./date-time-picker";
import { InputNumberFormItem } from "./input-number";
import { RadioGroupFormItem } from "./radio-group";
import { SelectFieldFormItem } from "./select";
import { AgGridDropdownFormItem } from "./select-data-grid";
import { SwitchFormItem } from "./switch";
import { TextAreaFormItem } from "./text-area";
import { TextFieldFormItem } from "./text-field";
import { AutocompleteFieldFormItem } from "./auto-complete";

const FormItem: React.FC<FormItemProps> = (props) => {
    // TODO: move the controller wrapper logic to a common place

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
            case "checkbox-group":
                return <CheckboxGroupFormItem {...props} />;
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
            case "date-time-picker":
                return <DateTimePickerFormItem {...props} />;
            case "autocomplete":
                return <AutocompleteFieldFormItem {...props} />;

            default:
                return null;
        }
    };

    return (
        <Stack direction={"row"} spacing={2} alignItems={"start"} className="mb-2">
            {getFormComponent()}
        </Stack>
    );
};

export default FormItem;
