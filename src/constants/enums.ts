export enum Gender {
    FEMALE = 0,
    MALE = 1,
    OTHER = 2,
}

export enum TestResultStatus {
    POSITIVE = "positive",
    NEGATIVE = "negative",
}

export enum PaymentType {
    CASH,
    ATM,
    TRANSFER,
}

export enum ReceiptPaymentType {
    PAID,
    UNPAID,
    REFUND,
    CANCEL,
}

export enum UploadedFileType {
    REPORT = "Report",
    STATISTICS = "Statistics",
    SUPPLIER = "Supplier",
    CONTRACT = "Contract",
}

export enum MedicineBatchExpiredFormStatus {
    PENDING,
    APPROVED,
    REJECTED,
}
