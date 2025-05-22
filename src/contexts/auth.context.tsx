import React, { PropsWithChildren } from "react";
import { endpoints } from "../constants/endpoints";
import { HttpMethod } from "../constants/enums";
import { User } from "../entities";
import { useHttpContext } from "./http.context";

export type LoginParams = {
    userName: string;
    password: string;
};

export type AuthContextProps = {
    isLoading: boolean;
    user: User | null;
    error: string;
    login: (params: LoginParams) => Promise<void>;
    logout: () => void;
};

const defaultProvider: AuthContextProps = {
    isLoading: true,
    user: null,
    error: "",
    login: () => Promise.resolve(),
    logout: () => {},
};

export const AuthContext = React.createContext(defaultProvider);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const { callApi } = useHttpContext();
    const [user, setUser] = React.useState<User | null>(null);
    const [error, setError] = React.useState<string>("");

    const loadUserInfor = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await callApi({
                url: endpoints.authEndpoints.me,
                method: HttpMethod.GET,
            });
            setUser(data);
            setIsLoading(false);
        } catch (error) {
            setError((error as any).message);
            setIsLoading(false);
        }
    }, []);

    const handleLogin = async (params: LoginParams) => {
        try {
            setIsLoading(true);
            await callApi({
                url: endpoints.authEndpoints.login,
                method: HttpMethod.POST,
                data: params,
            });
            await loadUserInfor();
            setIsLoading(false);
        } catch (error) {
            setError((error as any).message);
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
            setIsLoading(false);
        } catch (error) {
            setError((error as any).message);
            setIsLoading(false);
        }
    };

    const initializeUser = async () => {
        await loadUserInfor();
        setError("");
    };

    React.useEffect(() => {
        initializeUser();
    }, []);

    const value = {
        isLoading,
        user,
        error,
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
