import { endpoints } from "~/constants/endpoints";
import { HttpMethod } from "~/constants/enums";
import { User } from "~/entities";
import { callApi } from "~/libs/axios/request";
import { IBaseApiResponse } from "~/libs/axios/types";
import { LogOutResponse, RefreshTokenResponse, TLoginRequest, TLoginResponse } from "./types";

const login = async (params: TLoginRequest): Promise<IBaseApiResponse<TLoginResponse>> => {
    return await callApi<TLoginResponse>({
        url: endpoints.auth.login,
        method: HttpMethod.POST,
        data: params,
    });
};

const refreshToken = async (): Promise<IBaseApiResponse<RefreshTokenResponse>> => {
    return await callApi<RefreshTokenResponse>({
        url: endpoints.auth.refreshToken,
        method: HttpMethod.POST,
        data: null,
    });
};

const getCurrentUser = async (): Promise<IBaseApiResponse<User>> => {
    return await callApi<User>({
        url: endpoints.auth.currentUser,
        method: HttpMethod.GET,
    });
};

const logout = async (): Promise<IBaseApiResponse<LogOutResponse>> => {
    return await callApi<LogOutResponse>({
        url: endpoints.auth.logout,
        method: HttpMethod.POST,
        data: null,
    });
};

export const authService = { login, logout, refreshToken, getCurrentUser };
