import { endpoints } from "~/constants/endpoints";
import { PaymentStatus } from "~/constants/enums";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { ISearchParam } from "~/services/hospital-service/infras";
import {
    CheckPaymentStatusRequest,
    CreateQRPaymentResponse,
    CreateReceiptPaymentRequest,
    CreateReceiptPaymentResponse,
    GetPatientPaymentsResponse,
    GetPaymentDetailsResponse,
    HospitalUnpaidServicesResponse,
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
    return await callApi<CreateReceiptPaymentResponse>({
        url: endpoints.hospitalFee.createReceiptPayment(patientId),
        method: HttpMethod.POST,
        data: payload,
    });
};

const createQRPayment = async (patientId: number, payload: CreateReceiptPaymentRequest) => {
    return await callApi<CreateQRPaymentResponse>({
        url: endpoints.hospitalFee.createQRPayment(patientId),
        method: HttpMethod.POST,
        data: payload,
    });
};

const checkPaymentStatus = async (payload: CheckPaymentStatusRequest) => {
    return await callApi<PaymentStatus>({
        url: `${endpoints.hospitalFee.checkPaymentStatus}`,
        method: HttpMethod.GET,
        params: payload,
    });
};

export const hospitalFeeApis = {
    getUnpaidPatientsList,
    getPatientPayment,
    getPaymentDetailByPaymentId,
    getUnpaidServiceByPatientId,
    createReceiptPayment,
    createQRPayment,
    checkPaymentStatus,
};
