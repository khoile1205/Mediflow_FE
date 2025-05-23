import { Suspense } from "react";
import { Routes } from "react-router";
import Spinner from "~/components/spinner";
import { AuthenticatedRoutes } from "./authenticated.route";
import { PublicRoutes } from "./public.route";

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
