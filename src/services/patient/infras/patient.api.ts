import { endpoints } from "~/constants/endpoints";
import { Patient } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IPagination } from "~/libs/axios/types";
import { GetPatientWithPaginationRequest } from "./types";

const generatePatientIdentifier = async () => {
    return;
};

const getListPatientWithPagination = async ({
    pageIndex = 1,
    pageSize = 10,
    ...params
}: GetPatientWithPaginationRequest) => {
    return await callApi<IPagination<Patient>>({
        url: endpoints.patient.getListPatientWithPagination,
        method: HttpMethod.GET,
        params: {
            pageIndex,
            pageSize,
            ...params,
        },
    });
};

export const patientApi = {
    generatePatientIdentifier,
    getListPatientWithPagination,
};
