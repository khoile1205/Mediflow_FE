import { AxiosError } from "axios";
import React, { PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { APP_STRING } from "~/constants/app.string";
import { IBaseApiResponse } from "~/libs/axios/types";
import { showToast } from "~/utils";
import { endpoints } from "../constants/endpoints";
import { HttpMethod } from "../constants/enums";
import { User } from "../entities";
import { useHttpContext } from "./http.context";

export type LoginParams = {
    userName: string;
    password: string;
};

export type TLoginResponse = {
    isSuccess: boolean;
    message: string;
};

export type AuthContextProps = {
    isLoading: boolean;
    user: User | null;
    login: (params: LoginParams) => Promise<void>;
    logout: () => void;
};

const defaultProvider: AuthContextProps = {
    isLoading: true,
    user: null,
    login: () => Promise.resolve(),
    logout: () => {},
};

export const AuthContext = React.createContext(defaultProvider);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const navigate = useNavigate();
    const { callApi } = useHttpContext();
    const [user, setUser] = React.useState<User | null>(null);

    const loadUserInfor = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await callApi<User>({
                url: endpoints.authEndpoints.me,
                method: HttpMethod.GET,
            });
            setUser(response.Data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogin = async (params: LoginParams) => {
        try {
            setIsLoading(true);
            await callApi<TLoginResponse>({
                url: endpoints.authEndpoints.login,
                method: HttpMethod.POST,
                data: params,
            });
            showToast.success(APP_STRING.LOGIN_SUCCESS);
            await loadUserInfor();
            navigate("/");
        } catch (error) {
            const axiosError = error as AxiosError<IBaseApiResponse<TLoginResponse>>;
            if (!axiosError.response) {
                showToast.error(APP_STRING.SOMETHING_WENT_WRONG);
                return;
            }
            showToast.error(axiosError.response.data.Message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await callApi({
                url: endpoints.authEndpoints.logout,
                method: HttpMethod.POST,
                data: {},
            });
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const initializeUser = async () => {
        await loadUserInfor();
    };

    React.useEffect(() => {
        initializeUser();
    }, []);

    const value = {
        isLoading,
        user,
        login: handleLogin,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within a AuthContextProvider");
    }

    return context;
};
