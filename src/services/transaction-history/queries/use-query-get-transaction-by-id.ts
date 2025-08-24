import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { TransactionDetail } from "~/entities";
import { IBaseApiResponse } from "~/libs/axios/types";
import { transactionHistoryApi } from "../infras";

const transformTransactions = (response: IBaseApiResponse<TransactionDetail>): TransactionDetail => {
    return response.Data as TransactionDetail;
};

export const useQueryGetTransactionById = (transactionId: number) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<TransactionDetail>>({
        queryKey: [QueryKey.TRANSACTION_HISTORY.GET_TRANSACTION_HISTORY_BY_ID, transactionId],
        queryFn: () => transactionHistoryApi.getTransactionDetailById(transactionId),
        enabled: !!transactionId,
    });

    const transaction = React.useMemo(() => {
        if (!response || isError || isLoading) return null;
        return transformTransactions(response);
    }, [response, isError, isLoading]);

    return {
        data: transaction,
        isLoading,
        isError,
        refetch,
    };
};
