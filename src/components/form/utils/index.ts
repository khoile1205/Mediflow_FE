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
        validation.required = "Vui lòng không để trống trường này";
    }

    if (rules.minLength !== undefined && rules.minLength > 0) {
        validation.minLength = {
            value: rules.minLength,
            message: `Nhập ít nhất ${rules.minLength} ký tự`,
        };
    }

    if (rules.maxLength !== undefined) {
        validation.maxLength = {
            value: rules.maxLength,
            message: `Chỉ được nhập tối đa ${rules.maxLength} ký tự`,
        };
    }

    if (rules.minNumber !== undefined) {
        validation.min = {
            value: rules.minNumber,
            message: `Giá trị phải lớn hơn hoặc bằng ${rules.minNumber}`,
        };
    }

    if (rules.maxNumber !== undefined) {
        validation.max = {
            value: rules.maxNumber,
            message: `Giá trị phải nhỏ hơn hoặc bằng ${rules.maxNumber}`,
        };
    }

    if (rules.pattern) {
        validation.pattern = {
            value: typeof rules.pattern === "string" ? new RegExp(rules.pattern) : rules.pattern,
            message: "Định dạng không đúng",
        };
    }

    if (rules.isEmail) {
        validation.pattern = {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Email không hợp lệ",
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
            return new Date(value) >= new Date(rules.minDate!)
                ? true
                : `Vui lòng chọn ngày sau ${formatDateToDDMMYYYY(rules.minDate!)}`;
        };
    }

    if (rules.maxDate) {
        validation.validate = (value: Date) => {
            return new Date(value) <= new Date(rules.maxDate!)
                ? true
                : `Vui lòng chọn ngày trước ${formatDateToDDMMYYYY(rules.maxDate!)}`;
        };
    }

    return validation;
};
