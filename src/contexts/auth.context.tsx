import { AxiosError } from "axios";
import React, { PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { APP_STRING } from "~/constants/app.string";
import { IBaseApiResponse } from "~/libs/axios/types";
import { authService } from "~/services/auth";
import { TLoginRequest, TLoginResponse } from "~/services/auth/types";
import { showToast } from "~/utils";
import { User } from "../entities";

export type AuthContextProps = {
    isLoading: boolean;
    isInitialized: boolean;
    user: User | null;
    login: (params: TLoginRequest) => Promise<void>;
    logout: () => void;
};

const defaultProvider: AuthContextProps = {
    isLoading: true,
    isInitialized: false,
    user: null,
    login: () => Promise.resolve(),
    logout: () => {},
};

export const AuthContext = React.createContext(defaultProvider);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<User | null>(null);
    const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
    const navigate = useNavigate();

    const loadUserInfor = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await authService.getCurrentUser();
            setUser(response.Data);
            navigate("/");
        } catch {
            setUser(null);
            navigate("/login");
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, []);

    const handleLogin = React.useCallback(async (params: TLoginRequest) => {
        try {
            setIsLoading(true);
            await authService.login(params);
            await loadUserInfor();
            showToast.success(APP_STRING.LOGIN_SUCCESS);
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
    }, []);

    const handleLogout = React.useCallback(async () => {
        try {
            setIsLoading(true);
            await authService.logout();
            navigate("/login");
            showToast.success(APP_STRING.LOGOUT_SUCCESS);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const initializeUser = async () => {
        await loadUserInfor();
    };

    React.useEffect(() => {
        initializeUser();
    }, []);

    const value = React.useMemo(
        () => ({
            isLoading,
            isInitialized,
            user,
            login: handleLogin,
            logout: handleLogout,
        }),
        [isLoading, isInitialized, user, handleLogin, handleLogout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within a AuthContextProvider");
    }

    return context;
};
