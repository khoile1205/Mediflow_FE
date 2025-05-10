import React, { PropsWithChildren, useContext } from "react";
import { callApi } from "../libs/axios/request";
import { TApiRequest } from "../libs/axios/types";

// Define the context
interface HttpContextProps {
    // loading: boolean;
    callApi: (props: TApiRequest) => Promise<any>;
}

const HttpContext = React.createContext<HttpContextProps | undefined>(undefined);

// Custom hook to access the context
const useHttpContext = () => {
    const context = useContext(HttpContext);
    if (!context) {
        throw new Error("useHttpContext must be used within a HttpContextProvider");
    }
    return context;
};

// Provider component
const HttpContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return <HttpContext.Provider value={{ callApi }}>{children}</HttpContext.Provider>;
};

export { HttpContextProvider, useHttpContext };
