export interface ExpiredReturnFormValues {
    returnCode: string;
    reason: string;
    receiverSupplier: string;
    receiverName: string;
    receiverEmail: string;
    receiverPhone: string;
    details: ExpiredMedicineBatch[];
}

export interface ExpiredMedicineBatch {
    medicineBatchId: number;
    batchNumber: string;
    expirationDate: string;
    quantity: number;
}
