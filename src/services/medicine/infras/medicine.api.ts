import { endpoints } from "~/constants/endpoints";
import { Medicine } from "~/entities/medicine";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IPagination, IPaginationRequest } from "~/libs/axios/types";
import { IGetMedicineSearchParam } from "./types";

const getMedicinesWithPagination = async ({
    pageIndex = 1,
    pageSize = 10,
    searchKeyword,
}: IPaginationRequest & IGetMedicineSearchParam) => {
    return await callApi<IPagination<Medicine>>({
        url: endpoints.inventory.medicine.standard,
        method: HttpMethod.GET,
        params: {
            pageIndex,
            pageSize,
            searchKeyword,
        },
    });
};

export const medicineApis = {
    getMedicinesWithPagination,
};
