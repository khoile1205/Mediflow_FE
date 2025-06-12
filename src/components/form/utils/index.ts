import { FieldValues, Path, RegisterOptions } from "react-hook-form";
import { TValidationRules } from "../types/validation";
import { BaseOption } from "../types/form-item";
import { formatDateToDDMMYYYY } from "../../../utils/date-time";
import i18n from "~/configs/i18n";

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
        validation.required = i18n.t(i18n.translationKey.requiredField);
    }

    if (rules.minLength !== undefined && rules.minLength > 0) {
        validation.minLength = {
            value: rules.minLength,
            message: i18n.t(i18n.translationKey.enterAtLeastMinLengthCharacter, { min_length: rules.minLength }),
        };
    }

    if (rules.maxLength !== undefined) {
        validation.maxLength = {
            value: rules.maxLength,
            message: i18n.t(i18n.translationKey.onlyEnterUpToMaxLengthCharacter, { max_length: rules.maxLength }),
        };
    }

    if (rules.minNumber !== undefined) {
        validation.min = {
            value: rules.minNumber,
            message: i18n.t(i18n.translationKey.valueMustBeGreaterThanOrEqualTo, { value: rules.minNumber }),
        };
    }

    if (rules.maxNumber !== undefined) {
        validation.max = {
            value: rules.maxNumber,
            message: i18n.t(i18n.translationKey.valueMustBeLessThanOrEqualTo, { value: rules.maxNumber }),
        };
    }

    if (rules.pattern) {
        validation.pattern = {
            value: typeof rules.pattern === "string" ? new RegExp(rules.pattern) : rules.pattern,
            message: i18n.t(i18n.translationKey.invalidFormat),
        };
    }

    if (rules.isEmail) {
        validation.pattern = {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: i18n.t(i18n.translationKey.invalidEmail),
        };
    }

    // if (rules.isPassword) {
    //     validation.pattern = {
    //         value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
    //         message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số",
    //     };
    // }

    if (rules.minDate) {
        validation.validate = (value: Date) => {
            return new Date(value) >= new Date(rules.minDate)
                ? true
                : i18n.t(i18n.translationKey.pleaseSelectADateAfter, { date: formatDateToDDMMYYYY(rules.minDate) });
        };
    }

    if (rules.maxDate) {
        validation.validate = (value: Date) => {
            return new Date(value) <= new Date(rules.maxDate)
                ? true
                : i18n.t(i18n.translationKey.pleaseSelectADateBefore, { date: formatDateToDDMMYYYY(rules.maxDate) });
        };
    }

    return validation;
};
