import { AutocompleteFieldFormItemProps } from "../form-item/auto-complete";
import { SingleCheckboxFormItemProps } from "../form-item/checkbox";
import { CheckboxGroupFormItemProps } from "../form-item/checkbox-group";
import { DatePickerFormItemProps } from "../form-item/date-picker";
import { DateRangePickerFormItemProps } from "../form-item/date-range-picker";
import { DateTimePickerFormItemProps } from "../form-item/date-time-picker";
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
    | ({ render: "checkbox" } & SingleCheckboxFormItemProps)
    | ({ render: "checkbox-group" } & CheckboxGroupFormItemProps)
    | ({ render: "date-picker" } & DatePickerFormItemProps)
    | ({ render: "date-range-picker" } & DateRangePickerFormItemProps)
    | ({ render: "switch" } & SwitchFormItemProps)
    | ({ render: "radio-group" } & RadioGroupFormItemProps)
    | ({ render: "text-area" } & TextAreaFormItemProps)
    | ({ render: "input-number" } & InputNumberFormItemProps)
    | ({ render: "date-time-picker" } & DateTimePickerFormItemProps)
    | ({ render: "autocomplete" } & AutocompleteFieldFormItemProps);

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
    value: string | number;
};
