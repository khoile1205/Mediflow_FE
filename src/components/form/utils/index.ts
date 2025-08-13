import { FieldValues, Path, RegisterOptions } from "react-hook-form";
import { TValidationRules } from "../types/validation";
import { BaseOption } from "../types/form-item";
import i18n from "~/configs/i18n";
import { formatDate, normalizeStartDate } from "~/utils/date-time";
import { DATE_TIME_FORMAT } from "~/constants/date-time.format";
import { EMAIL_PATTERN } from "../validation/pattern";
import { TFunction } from "i18next";

export const toBaseOption = <T>(source: T[], options: { label: keyof T; value: keyof T }): BaseOption[] => {
    return source.map((item) => ({
        value: item[options.value] as string,
        label: item[options.label] as string,
    }));
};

export const mapValidationRules = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>(
    rules: TValidationRules,
    t: TFunction,
): RegisterOptions<TFieldValues, TName> => {
    const validation: RegisterOptions<TFieldValues, TName> = {};

    validation.validate = {};

    if (rules.required) {
        validation.validate.required = (value: unknown) => (value ? true : t(i18n.translationKey.requiredField));
    }

    if (rules.minLength !== undefined && rules.minLength > 0) {
        validation.validate.minLength = (value: string) =>
            value?.length >= rules.minLength
                ? true
                : t(i18n.translationKey.enterAtLeastMinLengthCharacter, {
                      min_length: rules.minLength,
                  });
    }

    if (rules.maxLength !== undefined) {
        validation.validate.maxLength = (value: string) =>
            value?.length <= rules.maxLength
                ? true
                : t(i18n.translationKey.onlyEnterUpToMaxLengthCharacter, {
                      max_length: rules.maxLength,
                  });
    }

    if (rules.minNumber !== undefined) {
        validation.validate.minNumber = (value: number) =>
            Number(value) >= rules.minNumber
                ? true
                : t(i18n.translationKey.valueMustBeGreaterThanOrEqualTo, {
                      value: rules.minNumber,
                  });
    }

    if (rules.maxNumber !== undefined) {
        validation.validate.maxNumber = (value: number) =>
            Number(value) <= rules.maxNumber
                ? true
                : t(i18n.translationKey.valueMustBeLessThanOrEqualTo, {
                      value: rules.maxNumber,
                  });
    }

    if (rules.pattern) {
        const pattern = typeof rules.pattern === "string" ? new RegExp(rules.pattern) : rules.pattern;
        validation.validate.pattern = (value: string) => {
            if (!rules.required && !value) {
                return true;
            }

            return pattern.test(value) ? true : t(i18n.translationKey.invalidFormat);
        };
    }

    if (rules.isEmail) {
        validation.validate.isEmail = (value: string) =>
            EMAIL_PATTERN.test(value) ? true : t(i18n.translationKey.invalidEmail);
    }

    if (rules.minDate) {
        validation.validate.minDate = (value: Date) =>
            new Date(value) >= new Date(rules.minDate)
                ? true
                : t(i18n.translationKey.pleaseSelectADateAfter, {
                      date: formatDate(rules.minDate, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                  });
    }

    if (rules.maxDate) {
        validation.validate.maxDate = (value: Date) =>
            new Date(value) <= new Date(rules.maxDate)
                ? true
                : t(i18n.translationKey.pleaseSelectADateBefore, {
                      date: formatDate(rules.maxDate, DATE_TIME_FORMAT["dd/MM/yyyy"]),
                  });
    }

    if (rules.noPastDate) {
        validation.validate.noPastDate = (value: Date) => {
            const today = normalizeStartDate(new Date());

            return new Date(value) >= today ? true : t(i18n.translationKey.dateMustNotBeInThePast);
        };
    }

    if (rules.noFutureDate) {
        validation.validate.noFutureDate = (value: Date) => {
            const today = normalizeStartDate(new Date());
            return new Date(value) <= today ? true : t(i18n.translationKey.dateMustNotBeInTheFuture);
        };
    }

    return validation;
};
