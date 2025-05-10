import { Route } from "react-router";
import App from "../App";
import ExamplePage from "../pages/template/app";
import TemplateForm from "../pages/template/form";

export const PublicRoutes = (
    <Route>
        <Route path="/" element={<App />} />
        <Route>
            <Route path="/template/app" element={<ExamplePage />} />
            <Route path="/template/form" element={<TemplateForm />} />
        </Route>
    </Route>
);
