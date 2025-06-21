import { endpoints } from "~/constants/endpoints";
import { Medicine } from "~/entities/medicine";
import { callApi } from "~/libs/axios/request";
import { IPaginationRequest, IPagination, HttpMethod } from "~/libs/axios/types";

const getMedicinesWithPagination = async ({ pageIndex = 1, pageSize = 10 }: IPaginationRequest) => {
    return await callApi<IPagination<Medicine>>({
        url: endpoints.inventory.medicine.standard,
        method: HttpMethod.GET,
        params: {
            pageIndex,
            pageSize,
        },
    });
};

export const medicineService = {
    getMedicinesWithPagination,
};
