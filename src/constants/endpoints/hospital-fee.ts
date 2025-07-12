const getUnpaidPatientList = `vaccination-reception/patients/unpaid-services`;
const getPatientPayment = (patientId: number) => `vaccination-reception/patients/${patientId}/payments`;
const getPaymentDetailByPaymentId = (paymentId: number) => `vaccination-reception/payments/${paymentId}/details`;
const getUnpaidServiceByPatientId = (patientId: number) =>
    `vaccination-reception/patients/${patientId}/unpaid-services`;
const createReceiptPayment = (patientId: number) => `vaccination-reception/receptions/${patientId}/payments`;

export const hospitalEndpoints = {
    getUnpaidPatientList,
    getPatientPayment,
    getPaymentDetailByPaymentId,
    getUnpaidServiceByPatientId,
    createReceiptPayment,
};
