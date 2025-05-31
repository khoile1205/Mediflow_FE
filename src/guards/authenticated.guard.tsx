import { Box } from "@mui/material";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { showToast } from "~/utils";
import { useAuth } from "../contexts/auth.context";
import { Spinner } from "~/components/spinner";
import { Sidebar } from "~/components/sidebar";

const AuthenticatedGuard: React.FC = () => {
    const { user, isLoading, isInitialized } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (!isInitialized) {
            return;
        }

        if (!user) {
            sessionStorage.setItem("redirectUrl", location.pathname);
            showToast.warning("Vui lòng đăng nhập để tiếp tục");
            navigate("/login");
        }
    }, [navigate, location.pathname, isInitialized]);

    if (isLoading || !user) {
        return <Spinner />;
    }

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
