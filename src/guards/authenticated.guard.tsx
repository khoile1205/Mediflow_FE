import { Box } from "@mui/material";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { showToast } from "~/utils";
import { useAuth } from "../contexts/auth.context";
import { Spinner } from "~/components/layout/spinner";
import { Sidebar } from "~/components/layout/sidebar";
import { useTranslation } from "react-i18next";
import i18n from "~/configs/i18n";
import { routePermissions } from "~/configs/route-permission";
import { getRequiredPermissionForPath, hasPermission } from "~/utils/permission.utils";

const AuthenticatedGuard: React.FC = () => {
    const { t } = useTranslation();
    const { user, isLoading, isInitialized, userPermission } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const resourceTypes = userPermission?.resourceTypes ?? {};
    const requiredPermissions = getRequiredPermissionForPath(location.pathname, routePermissions);
    const hasAccess = hasPermission(resourceTypes, requiredPermissions);

    if (!isInitialized || isLoading || !user || !userPermission || !userPermission.resourceTypes) {
        return <Spinner />;
    }

    if (requiredPermissions && !hasAccess) {
        // Prevent flash render
        navigate("/");
        showToast.error(t(i18n.translationKey.accessDenied));
        return null;
    }

    // React.useEffect(() => {
    //     if (!isInitialized || isLoading || !user || !userPermission) {
    //         return;
    //     }

    //     if (!user) {
    //         sessionStorage.setItem("redirectUrl", location.pathname);
    //         showToast.warning(t(i18n.translationKey.pleaseLoginToContinue));
    //         navigate("/login");
    //     }

    //     const requiredPermissions = getRequiredPermissionForPath(location.pathname, routePermissions);
    //     const hasAccess = hasPermission(userPermission?.resourceTypes ?? {}, requiredPermissions);

    //     if (requiredPermissions && !hasAccess) {
    //         showToast.warning(t(i18n.translationKey.accessDenied));
    //         navigate("/");
    //     }
    // }, [navigate, location.pathname, isInitialized, isLoading, user, userPermission]);

    // if (!isInitialized || isLoading || !user || !userPermission) {
    //     return <Spinner />;
    // }

    return (
        <Box className="flex h-screen w-screen">
            <Sidebar />
            <Box className="w-full flex-1 overflow-y-auto p-2">
                <Outlet />
            </Box>
        </Box>
    );
};

export default AuthenticatedGuard;
