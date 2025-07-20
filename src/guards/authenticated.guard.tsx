import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Sidebar } from "~/components/layout/sidebar";
import { Spinner } from "~/components/layout/spinner";
import i18n from "~/configs/i18n";
import { routePermissions } from "~/configs/route-permission";
import { showToast } from "~/utils";
import { getRequiredPermissionForPath, hasPermission } from "~/utils/permission.utils";
import { useAuth } from "../contexts/auth.context";

const AuthenticatedGuard: React.FC = () => {
    const { t } = useTranslation();
    const { user, isLoading, isInitialized, userPermission } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (!isInitialized || isLoading) {
            return;
        }

        if (!user) {
            sessionStorage.setItem("redirectUrl", location.pathname);
            showToast.warning(t(i18n.translationKey.pleaseLoginToContinue));
            navigate("/login");
        }

        const { requiredPermissions = [], requiredRoles = [] } = getRequiredPermissionForPath(
            location.pathname,
            routePermissions,
        );

        const hasAccess = hasPermission({
            resourceTypes: userPermission?.resourceTypes,
            requiredPermissions,
            userRoles: userPermission?.roles || [],
            requiredRoles,
            accessModifier: userPermission?.resourceTypes[requiredPermissions[0]],
        });

        if (requiredPermissions && !hasAccess) {
            showToast.warning(t(i18n.translationKey.accessDenied));
            navigate("/");
        }
    }, [navigate, location.pathname, isInitialized, isLoading, userPermission, user]);

    if (!isInitialized || isLoading) {
        return <Spinner />;
    }

    return (
        <Box className="flex h-full w-screen">
            <Sidebar />
            <Box className="h-full min-h-screen w-full flex-1 overflow-y-auto p-2">
                <Outlet />
            </Box>
        </Box>
    );
};

export default AuthenticatedGuard;
