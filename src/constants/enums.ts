export enum Gender {
    FEMALE,
    MALE,
}

export enum TestResultStatus {
    POSITIVE = "positive",
    NEGATIVE = "negative",
}

export enum PaymentMethod {
    CASH = 0,
    ATM,
    TRANSFER = 3,
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

export enum HospitalServiceType {
    Exam,
    Injection,
    Test,
}

export enum PaymentStatus {
    COMPLETED,
    CANCELLED,
    ADJUSTED,
    PENDING,
}
