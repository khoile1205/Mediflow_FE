import React, { PropsWithChildren, useContext } from "react";
import { callApi } from "../libs/axios/request";
import { IBaseApiResponse, TApiRequest } from "../libs/axios/types";

interface HttpContextProps {
    callApi: <T>(props: TApiRequest) => Promise<IBaseApiResponse<T>>;
}

const HttpContext = React.createContext<HttpContextProps | undefined>(undefined);

const useHttpContext = () => {
    const context = useContext(HttpContext);
    if (!context) {
        throw new Error("useHttpContext must be used within a HttpContextProvider");
    }
    return context;
};

const HttpContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return <HttpContext.Provider value={{ callApi }}>{children}</HttpContext.Provider>;
};

export { HttpContextProvider, useHttpContext };
