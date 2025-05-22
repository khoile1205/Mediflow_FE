import { CheckboxFormItemProps } from "../form-item/checkbox";
import { DatePickerFormItemProps } from "../form-item/date-picker";
import { DateRangePickerFormItemProps } from "../form-item/date-range-picker";
import { InputNumberFormItemProps } from "../form-item/input-number";
import { RadioGroupFormItemProps } from "../form-item/radio-group";
import { SelectFieldFormItemProps } from "../form-item/select";
import { AgGridDropdownFormItemProps } from "../form-item/select-data-grid";
import { SwitchFormItemProps } from "../form-item/switch";
import { TextAreaFormItemProps } from "../form-item/text-area";
import { TextFieldFormItemProps } from "../form-item/text-field";

export type FormItemProps =
    | ({ render: "text-input" } & TextFieldFormItemProps)
    | ({ render: "select" } & SelectFieldFormItemProps)
    | ({ render: "data-grid" } & AgGridDropdownFormItemProps)
    | ({ render: "checkbox" } & CheckboxFormItemProps)
    | ({ render: "date-picker" } & DatePickerFormItemProps)
    | ({ render: "date-range-picker" } & DateRangePickerFormItemProps)
    | ({ render: "switch" } & SwitchFormItemProps)
    | ({ render: "radio-group" } & RadioGroupFormItemProps)
    | ({ render: "text-area" } & TextAreaFormItemProps)
    | ({ render: "input-number" } & InputNumberFormItemProps);

export type BaseFormItemUIProps = {
    name: string;
    label?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    fullWidth?: boolean;
};

export type BaseFormItemValidationRules = {
    required?: boolean;
};

export type BaseFormItemProps = BaseFormItemUIProps & BaseFormItemValidationRules;

export type BaseOption = {
    label: string;
    value: string;
};
