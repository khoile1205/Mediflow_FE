import { callApi } from "~/libs/axios/request";
import { PatientReceptionRequest, ServiceReceptionRequest } from "./types";
import { endpoints } from "~/constants/endpoints";
import { HttpMethod } from "~/libs/axios/types";

const createPatientReception = async (data: PatientReceptionRequest) => {
    return await callApi({
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

export const receptionService = {
    createPatientReception,
    addServiceReception,
};
