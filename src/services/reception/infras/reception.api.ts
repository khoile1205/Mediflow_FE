import { endpoints } from "~/constants/endpoints";
import { ServiceType } from "~/entities/service-type.entity";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import {
    AddVaccinationIndicateReceptionRequest,
    PatientReceptionRequest,
    PatientReceptionResponse,
    ReceptionUnpaidServicesResponse,
    ServiceReceptionRequest,
    UpdateVaccinationIndicateReceptionRequest,
    VaccinationIndicateReception,
    VaccinationPreScreeningRequest,
    VaccinationServiceReception,
} from "./types";

const generatePatientIdentifier = async () => {
    return await callApi<string>({
        url: endpoints.reception.vaccinationReceptionEndpoints.generatePatientIdentifier,
        method: HttpMethod.GET,
    });
};

const createPatientReception = async (data: PatientReceptionRequest) => {
    return await callApi<PatientReceptionResponse>({
        url: endpoints.reception.vaccinationReceptionEndpoints.patientReception,
        method: HttpMethod.POST,
        data,
    });
};

const addServiceReception = async (data: ServiceReceptionRequest) => {
    return await callApi({
        url: endpoints.reception.vaccinationReceptionEndpoints.addServiceReception,
        method: HttpMethod.POST,
        data,
    });
};

const getAllServiceTypes = async () => {
    return await callApi<ServiceType[]>({
        url: endpoints.reception.vaccinationReceptionEndpoints.getAllServiceTypes,
        method: HttpMethod.GET,
    });
};

const getUnpaidServices = async (receptionId?: number) => {
    return await callApi<ReceptionUnpaidServicesResponse>({
        url: endpoints.reception.vaccinationReceptionEndpoints.getUnpaidServices(receptionId),
        method: HttpMethod.GET,
    });
};

const createPrevaccinationReport = async (data: VaccinationPreScreeningRequest) => {
    return await callApi<number>({
        url: endpoints.reception.vaccinationReceptionEndpoints.createPrevaccinationReport,
        method: HttpMethod.POST,
        data,
    });
};
const updateVaccinationPrescreening = async (
    vaccinationPrescreeningId: number,
    data: VaccinationPreScreeningRequest,
) => {
    return await callApi<number>({
        url: endpoints.reception.vaccinationReceptionEndpoints.updateVaccinationPrescreening(vaccinationPrescreeningId),
        method: HttpMethod.PUT,
        data: {
            ...data,
            id: vaccinationPrescreeningId,
        },
    });
};

const getServiceReceptionByReceptionId = async (receptionId: number) => {
    return await callApi<VaccinationServiceReception[]>({
        url: endpoints.reception.vaccinationReceptionEndpoints.getServiceReceptionByReceptionId(receptionId),
        method: HttpMethod.GET,
    });
};

const deleteServiceReceptionById = async (receptionId: number, listServiceIds: number[]) => {
    return await callApi({
        url: endpoints.reception.vaccinationReceptionEndpoints.deleteServiceReceptionByReceptionId(receptionId),
        method: HttpMethod.POST,
        data: listServiceIds,
    });
};

const getVaccinationReceptionByReceptionId = async (receptionId: number) => {
    return await callApi<VaccinationIndicateReception[]>({
        url: endpoints.reception.vaccinationReceptionEndpoints.getVaccinationReceptionByReceptionId(receptionId),
        method: HttpMethod.GET,
    });
};

const addVaccinationReception = async (receptionId: number, data: AddVaccinationIndicateReceptionRequest) => {
    return await callApi<VaccinationIndicateReception[]>({
        url: endpoints.reception.vaccinationReceptionEndpoints.addVaccinationReception,
        method: HttpMethod.POST,
        data: {
            ...data,
            receptionId,
        },
    });
};

const deleteVaccinationReceptionById = async (receptionId: number, listServiceIds: number[]) => {
    return await callApi({
        url: endpoints.reception.vaccinationReceptionEndpoints.deleteVaccinationReceptionById(receptionId),
        method: HttpMethod.POST,
        data: listServiceIds,
    });
};

const updateVaccinationReceptionByReceptionId = async (
    receptionId: number,
    data: UpdateVaccinationIndicateReceptionRequest,
) => {
    return await callApi<VaccinationIndicateReception>({
        url: endpoints.reception.vaccinationReceptionEndpoints.updateVaccinationReceptionByReceptionId(receptionId),
        method: HttpMethod.PUT,
        data,
    });
};

const getLatestReceptionIdByPatientId = async (patientId?: number) => {
    return await callApi<number>({
        url: endpoints.reception.vaccinationReceptionEndpoints.getLatestReceptionIdByPatientId(patientId),
        method: HttpMethod.GET,
    });
};

export const receptionApis = {
    generatePatientIdentifier,
    createPatientReception,
    addServiceReception,
    getAllServiceTypes,
    getUnpaidServices,
    createPrevaccinationReport,
    updateVaccinationPrescreening,
    getServiceReceptionByReceptionId,
    deleteServiceReceptionById,
    getVaccinationReceptionByReceptionId,
    deleteVaccinationReceptionById,
    addVaccinationReception,
    updateVaccinationReceptionByReceptionId,
    getLatestReceptionIdByPatientId,
};
