import { endpoints } from "~/constants/endpoints";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import {
    GetPatientPaymentsResponse,
    GetPaymentDetailsResponse,
    HospitalUnpaidServicesResponse,
    CreateReceiptPaymentRequest,
    UnpaidPatientSummary,
} from "./types";

const getUnpaidPatientsList = async ({ searchTerm = "" }: ISearchParam) => {
    return await callApi<UnpaidPatientSummary[]>({
        url: endpoints.hospitalFee.getUnpaidPatientList,
        method: HttpMethod.GET,
        params: { searchTerm },
    });
};

const getPatientPayment = async (patientId: number) => {
    return await callApi<GetPatientPaymentsResponse>({
        url: `${endpoints.hospitalFee.getPatientPayment(patientId)}`,
        method: HttpMethod.GET,
    });
};

const getPaymentDetailByPaymentId = async (paymentId: number) => {
    return await callApi<GetPaymentDetailsResponse>({
        url: `${endpoints.hospitalFee.getPaymentDetailByPaymentId(paymentId)}`,
        method: HttpMethod.GET,
    });
};
const getUnpaidServiceByPatientId = async (patientId: number) => {
    return await callApi<HospitalUnpaidServicesResponse>({
        url: `${endpoints.hospitalFee.getUnpaidServiceByPatientId(patientId)}`,
        method: HttpMethod.GET,
    });
};

const createReceiptPayment = async (patientId: number, payload: CreateReceiptPaymentRequest) => {
    return await callApi<number>({
        url: endpoints.hospitalFee.createReceiptPayment(patientId),
        method: HttpMethod.POST,
        data: payload,
    });
};

export const hospitalFeeApis = {
    getUnpaidPatientsList,
    getPatientPayment,
    getPaymentDetailByPaymentId,
    getUnpaidServiceByPatientId,
    createReceiptPayment,
};
