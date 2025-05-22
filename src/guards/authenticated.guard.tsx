import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import Spinner from "../components/spinner";
import { useAuth } from "../contexts/auth.context";
import { showToast } from "~/utils";

const AuthenticatedGuard: React.FC = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (!user) {
            sessionStorage.setItem("redirectUrl", location.pathname);
            showToast.warning("Vui lòng đăng nhập để tiếp tục");
            navigate("/login");
        }
    }, [navigate, location.pathname, user]);

    if (isLoading || !user) {
        return <Spinner />;
    }

    return <Outlet />;
};

export default AuthenticatedGuard;
