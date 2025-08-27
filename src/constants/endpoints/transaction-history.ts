const transactionHistoryEndpointPrefix = "/vaccination-reception/payments";

export const transactionHistoryEndpoints = {
    getAllTransactionHistory: `${transactionHistoryEndpointPrefix}`,
    getTransactionDetailById: (id: number) => `${transactionHistoryEndpointPrefix}/${id}/details`,
};
