import { BrowserRouter, Routes } from "react-router";
import { AuthenticatedRoutes } from "./authenticated.route";
import { PublicRoutes } from "./public.route";
import { Suspense } from "react";
import Spinner from "~/components/spinner";

export const ApplicationRoutes = () => {
    return (
        <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
            <Suspense fallback={<Spinner />}>
                <Routes>
                    {PublicRoutes}
                    {AuthenticatedRoutes}
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};
