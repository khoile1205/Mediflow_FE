import { Route } from "react-router";
import { lazy } from "react";
import { ExpiredMedicineCallbackPage } from "~/pages/pharmacy/expired-medicine";

const LoginPage = lazy(() => import("../pages/auth/login.page"));
const ExamplePage = lazy(() => import("../pages/template/app"));
const TemplateForm = lazy(() => import("../pages/template/form"));
const TemplateLayout = lazy(() => import("../pages/template/layout"));

export const PublicRoutes = (
    <Route>
        <Route path="template">
            <Route path="app" element={<ExamplePage />} />
            <Route path="form" element={<TemplateForm />} />
            <Route path="layout" element={<TemplateLayout />} />
        </Route>
        <Route>
            <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/pharmacy">
            <Route path="expired-medicine/:id/:action/callback" element={<ExpiredMedicineCallbackPage />} />
        </Route>
    </Route>
);
