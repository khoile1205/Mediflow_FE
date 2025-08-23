import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QueryKey } from "~/constants/query-key";
import { Transaction } from "~/entities";
import { IBaseApiResponse, IDateRangeRequest, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import { convertIsoToYYYYMMDD } from "~/utils/date-time";
import { transactionHistoryApi } from "../infras";

const transformData = (response: IBaseApiResponse<IPagination<Transaction>>): Transaction[] => {
    return response.Data.data.map((item) => ({ ...item })) as Transaction[];
};

export const useQueryGetTransactionHistory = (query: IPaginationRequest & ISearchParam & IDateRangeRequest) => {
    const {
        data: response,
        isLoading,
        isError,
        refetch,
    } = useQuery<IBaseApiResponse<IPagination<Transaction>>>({
        queryKey: [QueryKey.TRANSACTION_HISTORY.GET_LIST_TRANSACTION_HISTORY, query],
        queryFn: () =>
            transactionHistoryApi.getAllTransactionHistory({
                ...query,
                fromDate: convertIsoToYYYYMMDD(query.fromDate as Date),
                toDate: convertIsoToYYYYMMDD(query.toDate as Date),
            }),
    });

    const transactions = React.useMemo(() => {
        if (!response || isError || isLoading) return [];
        return transformData(response);
    }, [response, isError, isLoading]);

    const totalItems = React.useMemo(() => {
        if (isError || isLoading || !response) return 0;
        return response.Data.totalItems;
    }, [isError, isLoading, response]);

    return {
        data: { transactions, totalItems },
        isLoading,
        isError,
        refetch,
    };
};
