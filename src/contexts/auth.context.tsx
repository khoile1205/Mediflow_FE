import { AxiosError } from "axios";
import React, { PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { IBaseApiResponse } from "~/libs/axios/types";
import { authService } from "~/services/auth";
import { TLoginRequest, TLoginResponse } from "~/services/auth/types";
import { showToast } from "~/utils";
import i18n from "~/configs/i18n";
import { useTranslation } from "react-i18next";
import { Staff } from "~/entities/person-info.entity";
import { UserPermission } from "~/entities/user-permission";

export type AuthContextProps = {
    isLoading: boolean;
    isInitialized: boolean;
    user: Staff | null;
    userPermission?: UserPermission;
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
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<Staff | null>(null);
    const [userPermission, setUserPermission] = React.useState<UserPermission | null>(null);
    const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
    const navigate = useNavigate();

    const loadUserInfor = React.useCallback(async () => {
        try {
            const response = await authService.getCurrentUser();
            setUser(response.Data);
        } catch {
            setUser(null);
        }
    }, []);

    const loadUserPermission = React.useCallback(async () => {
        try {
            const response = await authService.getUserPermission();
            setUserPermission(response.Data);
        } catch {
            setUserPermission(null);
        }
    }, []);

    const handleLogin = React.useCallback(async (params: TLoginRequest) => {
        try {
            setIsLoading(true);

            await authService.login(params);
            await initializeUser();

            showToast.success(t(i18n.translationKey.loginSuccessfully));

            const redirectUrl = sessionStorage.getItem("redirectUrl");
            sessionStorage.removeItem("redirectUrl");
            navigate(redirectUrl ?? "/");
        } catch (error) {
            const axiosError = error as AxiosError<IBaseApiResponse<TLoginResponse>>;
            if (!axiosError.response) {
                showToast.error(t(i18n.translationKey.somethingWentWrong));
                return;
            }
            showToast.error(t(axiosError.response.data.MessageKey));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = React.useCallback(async () => {
        try {
            setIsLoading(true);
            await authService.logout();
            navigate("/login");
            showToast.success(t(i18n.translationKey.logoutSuccessfully));
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const initializeUser = async () => {
        setIsInitialized(false);
        setIsLoading(true);

        await loadUserInfor();
        await loadUserPermission();

        setIsInitialized(true);
        setIsLoading(false);
    };

    React.useEffect(() => {
        initializeUser();
    }, []);

    const value = React.useMemo(
        () => ({
            isLoading,
            isInitialized,
            user,
            userPermission,
            login: handleLogin,
            logout: handleLogout,
        }),
        [isLoading, isInitialized, user, userPermission, handleLogin, handleLogout],
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
