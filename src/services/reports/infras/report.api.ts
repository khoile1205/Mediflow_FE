import { endpoints } from "~/constants/endpoints";
import { axiosInstance } from "~/libs/axios/axios-instance";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IBaseApiResponse } from "~/libs/axios/types";
import {
    TDateRangeReportRequest,
    THospitalRevenueReportResponse,
    TMedicineRevenueResponse,
    TPatientStatisticResponse,
    TReportFile,
    TSupplyInventoryResponse,
} from "./types";

const getPatientStatisticReport = async (
    params: TDateRangeReportRequest,
): Promise<IBaseApiResponse<TPatientStatisticResponse>> => {
    return await callApi<TPatientStatisticResponse>({
        method: HttpMethod.GET,
        url: endpoints.reports.getPatientStatisticReport,
        params,
    });
};

const exportPatientStatisticReport = async (params: TDateRangeReportRequest): Promise<TReportFile> => {
    const response = await axiosInstance.get(endpoints.reports.exportPatientStatisticReport, {
        params,
        responseType: "blob",
    });

    return { blob: response.data };
};

const getHospitalRevenueReport = async (
    params: TDateRangeReportRequest,
): Promise<IBaseApiResponse<THospitalRevenueReportResponse>> => {
    return await callApi<THospitalRevenueReportResponse>({
        method: HttpMethod.GET,
        url: endpoints.reports.getHospitalRevenueReport,
        params,
    });
};

const exportHospitalRevenueReport = async (params: TDateRangeReportRequest): Promise<TReportFile> => {
    const response = await axiosInstance.get(endpoints.reports.exportHospitalRevenueReport, {
        params,
        responseType: "blob",
    });

    return { blob: response.data };
};

const getInventoryStatisticReport = async (
    params: TDateRangeReportRequest,
): Promise<IBaseApiResponse<TSupplyInventoryResponse>> => {
    return await callApi<TSupplyInventoryResponse>({
        method: HttpMethod.GET,
        url: endpoints.reports.getInventoryStatisticReport,
        params,
    });
};

const exportInventoryStatisticReport = async (params: TDateRangeReportRequest): Promise<TReportFile> => {
    const response = await axiosInstance.get(endpoints.reports.exportInventoryStatisticReport, {
        params,
        responseType: "blob",
    });

    return { blob: response.data };
};

const getMedicineRevenueReport = async (
    params: TDateRangeReportRequest,
): Promise<IBaseApiResponse<TMedicineRevenueResponse>> => {
    return await callApi<TMedicineRevenueResponse>({
        method: HttpMethod.GET,
        url: endpoints.reports.getMedicineRevenueReport,
        params,
    });
};

const exportMedicineRevenueReport = async (params: TDateRangeReportRequest): Promise<TReportFile> => {
    const response = await axiosInstance.get(endpoints.reports.exportMedicineRevenueReport, {
        params,
        responseType: "blob",
    });

    return { blob: response.data };
};

export const reportApis = {
    getPatientStatisticReport,
    exportPatientStatisticReport,
    getHospitalRevenueReport,
    exportHospitalRevenueReport,
    getInventoryStatisticReport,
    exportInventoryStatisticReport,
    getMedicineRevenueReport,
    exportMedicineRevenueReport,
};
