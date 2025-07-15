import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { PreExaminationMedicine, UpdatePreExaminationRequest } from "./types";
import { preExaminationEndpoints } from "~/constants/endpoints/pre-vaccination";

const getPreExaminationMedicines = async (receptionId: number) => {
    return await callApi<PreExaminationMedicine[]>({
        url: preExaminationEndpoints.getPreExaminationMedicines(receptionId),
        method: HttpMethod.GET,
    });
};

const addVaccineToPreExamination = async ({ receptionId, data }: { receptionId: number; data: number[] }) => {
    return await callApi<boolean>({
        url: preExaminationEndpoints.addVaccineToPreExamination(receptionId),
        method: HttpMethod.PUT,
        data,
    });
};

const updatePreExaminationResult = async (receptionVaccinationId: number, data: UpdatePreExaminationRequest) => {
    return await callApi<boolean>({
        url: preExaminationEndpoints.updatePreExaminationResult(receptionVaccinationId),
        method: HttpMethod.PUT,
        data,
    });
};

export const preExaminationApis = {
    getPreExaminationMedicines,
    addVaccineToPreExamination,
    updatePreExaminationResult,
};
