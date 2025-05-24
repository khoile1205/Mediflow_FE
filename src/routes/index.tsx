import { Suspense } from "react";
import { Routes } from "react-router";
import { AuthenticatedRoutes } from "./authenticated.route";
import { PublicRoutes } from "./public.route";
import { Spinner } from "~/components/spinner";

export const ApplicationRoutes = () => {
    return (
        <Suspense fallback={<Spinner />}>
            <Routes>
                {PublicRoutes}
                {AuthenticatedRoutes}
            </Routes>
        </Suspense>
    );
};
