import { endpoints } from "~/constants/endpoints";
import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { PatientReceptionRequest, PatientReceptionResponse, ServiceReceptionRequest } from "./types";

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

export const receptionApis = {
    generatePatientIdentifier,
    createPatientReception,
    addServiceReception,
};
