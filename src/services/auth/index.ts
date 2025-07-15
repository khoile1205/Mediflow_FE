import { endpoints } from "~/constants/endpoints";
import { callApi } from "~/libs/axios/request";
import { HttpMethod, IBaseApiResponse } from "~/libs/axios/types";
import { LogOutResponse, RefreshTokenResponse, ResetPasswordResponse, TLoginRequest, TLoginResponse } from "./types";
import { Staff } from "~/entities";
import { UserPermission } from "~/entities/user-permission";

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

const getCurrentUser = async (): Promise<IBaseApiResponse<Staff>> => {
    return await callApi<Staff>({
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

const getUserPermission = async (): Promise<IBaseApiResponse<UserPermission>> => {
    return await callApi<UserPermission>({
        url: endpoints.auth.userPermission,
        method: HttpMethod.GET,
    });
};

const resetPassword = async (payload: { email: string }): Promise<IBaseApiResponse<ResetPasswordResponse>> => {
    return await callApi<ResetPasswordResponse>({
        url: endpoints.auth.resetPassword,
        method: HttpMethod.POST,
        data: payload,
    });
};

export const authService = {
    login,
    logout,
    refreshToken,
    getCurrentUser,
    getUserPermission,
    resetPassword,
};
