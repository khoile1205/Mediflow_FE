const getUnpaidPatientList = `vaccination-reception/patients/unpaid-services`;
const getPatientPayment = (patientId: number) => `vaccination-reception/patients/${patientId}/payments`;
const getPaymentDetailByPaymentId = (paymentId: number) => `vaccination-reception/payments/${paymentId}/details`;
const getUnpaidServiceByPatientId = (patientId: number) =>
    `vaccination-reception/patients/${patientId}/unpaid-services`;
const createReceiptPayment = (patientId: number) => `vaccination-reception/receptions/${patientId}/payments`;
const createQRPayment = (patientId: number) => `vaccination-reception/receptions/${patientId}/payos-payment`;
const checkPaymentStatus = `vaccination-reception/payment-status`;

export const hospitalEndpoints = {
    getUnpaidPatientList,
    getPatientPayment,
    getPaymentDetailByPaymentId,
    getUnpaidServiceByPatientId,
    createReceiptPayment,
    createQRPayment,
    checkPaymentStatus,
};
