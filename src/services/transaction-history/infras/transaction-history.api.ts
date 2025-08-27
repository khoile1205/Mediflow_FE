import { HttpMethod, IDateRangeRequest, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { ISearchParam } from "../../hospital-service/infras";
import { callApi } from "~/libs/axios/request";
import { Transaction, TransactionDetail } from "~/entities";
import { endpoints } from "~/constants/endpoints";

const getAllTransactionHistory = async (params: IPaginationRequest & ISearchParam & IDateRangeRequest) => {
    return await callApi<IPagination<Transaction>>({
        url: endpoints.transactionHistory.getAllTransactionHistory,
        method: HttpMethod.GET,
        params,
    });
};

const getTransactionDetailById = async (id: number) => {
    return await callApi<TransactionDetail>({
        url: endpoints.transactionHistory.getTransactionDetailById(id),
        method: HttpMethod.GET,
    });
};

export const transactionHistoryApi = {
    getAllTransactionHistory,
    getTransactionDetailById,
};
