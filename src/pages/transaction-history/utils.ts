import { t } from "i18next";
import i18n from "~/configs/i18n";
import { PaymentMethod, PaymentStatus } from "~/constants/enums";

export const getPaymentMethod = (method: PaymentMethod) => {
    switch (method) {
        case PaymentMethod.CASH:
            return t(i18n.translationKey.cash);
        case PaymentMethod.ATM:
            return t(i18n.translationKey.atm);
        case PaymentMethod.TRANSFER:
            return t(i18n.translationKey.transfer);
        default:
            return t(i18n.translationKey.notAvailable);
    }
};

export const getPaymentStatus = (status: PaymentStatus) => {
    switch (status) {
        case PaymentStatus.PENDING:
            return t(i18n.translationKey.pending);
        case PaymentStatus.COMPLETED:
            return t(i18n.translationKey.completed);
        default:
            return t(i18n.translationKey.notAvailable);
    }
};
