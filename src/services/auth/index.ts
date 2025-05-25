import { IBaseApiResponse } from "~/libs/axios/types";
import { TLoginRequest, TLoginResponse } from "./types";
import { callApi } from "~/libs/axios/request";
import { endpoints } from "~/constants/endpoints";
import { HttpMethod } from "~/constants/enums";

const login = async (params: TLoginRequest): Promise<IBaseApiResponse<TLoginResponse>> => {
    return await callApi<TLoginResponse>({
        url: endpoints.authEndpoints.login,
        method: HttpMethod.POST,
        data: params,
    });
};

export { login };
