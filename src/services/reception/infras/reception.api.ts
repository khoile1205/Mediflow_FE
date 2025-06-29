import { endpoints } from "~/constants/endpoints";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import {
    PatientReceptionRequest,
    PatientReceptionResponse,
    ReceptionUnpaidServicesResponse,
    ServiceReceptionRequest,
    VaccinationPreScreeningRequest,
    VaccinationServiceReception,
} from "./types";
import { ServiceType } from "~/entities/service-type.entity";

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
        method: HttpMethod.POST,
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
};
