import { FieldValues, Path, RegisterOptions } from "react-hook-form";
import { TValidationRules } from "../types/validation";
import { BaseOption } from "../types/form-item";
import { formatDateToDDMMYYYY } from "../../../utils/date-time";

export const toBaseOption = <T>(source: T[], options: { label: keyof T; value: keyof T }): BaseOption[] => {
    return source.map((item) => ({
        value: item[options.value] as string,
        label: item[options.label] as string,
    }));
};

export const mapValidationRules = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>(
    rules: TValidationRules,
): RegisterOptions<TFieldValues, TName> => {
    const validation: RegisterOptions<TFieldValues, TName> = {};

    if (rules.required) {
        validation.required = "This field is required";
    }

    if (rules.minLength !== undefined && rules.minLength > 0) {
        validation.minLength = {
            value: rules.minLength,
            message: `Minimum length is ${rules.minLength}`,
        };
    }

    if (rules.maxLength !== undefined) {
        validation.maxLength = {
            value: rules.maxLength,
            message: `Maximum length is ${rules.maxLength}`,
        };
    }

    if (rules.minNumber !== undefined) {
        validation.min = {
            value: rules.minNumber,
            message: `Minimum value is ${rules.minNumber}`,
        };
    }

    if (rules.maxNumber !== undefined) {
        validation.max = {
            value: rules.maxNumber,
            message: `Maximum value is ${rules.maxNumber}`,
        };
    }

    if (rules.pattern) {
        validation.pattern = {
            value: typeof rules.pattern === "string" ? new RegExp(rules.pattern) : rules.pattern,
            message: "Invalid format",
        };
    }

    if (rules.isEmail) {
        validation.pattern = {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
        };
    }

    if (rules.isPassword) {
        validation.pattern = {
            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
            message: "Password must include letters and numbers (min 8 characters)",
        };
    }

    if (rules.minDate) {
        validation.validate = (value: Date) => {
            return new Date(value) >= new Date(rules.minDate!)
                ? true
                : `Date must be after ${formatDateToDDMMYYYY(rules.minDate!)}`;
        };
    }

    if (rules.maxDate) {
        validation.validate = (value: Date) => {
            return new Date(value) <= new Date(rules.maxDate!)
                ? true
                : `Date must be before ${formatDateToDDMMYYYY(rules.maxDate!)}`;
        };
    }

    return validation;
};
