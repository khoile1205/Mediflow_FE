import { Suspense } from "react";
import { Routes } from "react-router";
import { AuthenticatedRoutes } from "./authenticated.route";
import { PublicRoutes } from "./public.route";
import { Spinner } from "~/components/layout/spinner";
import { DocumentTitleUpdater } from "~/components/layout/document-title-updater";

export const ApplicationRoutes = () => {
    return (
        <DocumentTitleUpdater>
            <Suspense fallback={<Spinner />}>
                <Routes>
                    {PublicRoutes}
                    {AuthenticatedRoutes}
                </Routes>
            </Suspense>
        </DocumentTitleUpdater>
    );
};
