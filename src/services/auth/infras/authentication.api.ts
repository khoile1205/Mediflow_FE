import { callApi } from "~/libs/axios/request";
import { HttpMethod } from "~/libs/axios/types";
import { endpoints } from "~/constants/endpoints";
import { ConfirmPasswordRequest, ConfirmPasswordResponse } from "../types";

const confirmPassword = async (data: ConfirmPasswordRequest) => {
    return await callApi<ConfirmPasswordResponse>({
        url: endpoints.auth.confirmPassword,
        method: HttpMethod.POST,
        data,
    });
};

export const authenticationApi = {
    confirmPassword,
};
