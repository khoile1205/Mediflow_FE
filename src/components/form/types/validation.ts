export type TValidationRequired = {
    required?: boolean;
};

export type TValidationMinLength = {
    minLength?: number;
};

export type TValidationMaxLength = {
    maxLength?: number;
};

export type TValidationMinNumber = {
    minNumber?: number;
};

export type TValidationMaxNumber = {
    maxNumber?: number;
};

export type TValidationPattern = {
    pattern?: RegExp | string;
};

export type TValidationEmail = {
    isEmail?: boolean;
};

export type TValidationPassword = {
    isPassword?: boolean;
};

export type TValidationMinDate = {
    minDate?: Date;
};

export type TValidationMaxDate = {
    maxDate?: Date;
};
export type TValidationRules = TValidationRequired &
    TValidationMinLength &
    TValidationMaxLength &
    TValidationMinNumber &
    TValidationMaxNumber &
    TValidationPattern &
    TValidationEmail &
    TValidationPassword &
    TValidationMinDate &
    TValidationMaxDate;
