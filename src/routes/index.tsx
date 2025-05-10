import { BrowserRouter, Routes } from "react-router";
import { AuthenticatedRoutes } from "./authenticated.route";
import { PublicRoutes } from "./public.route";

export const ApplicationRoutes = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                {PublicRoutes}
                {AuthenticatedRoutes}
            </Routes>
        </BrowserRouter>
    );
};
