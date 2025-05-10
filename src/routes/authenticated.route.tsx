import { Route } from "react-router";
import AuthenticatedGuard from "../guards/authenticated.guard";

export const AuthenticatedRoutes = (
    <Route>
        <Route element={<AuthenticatedGuard />}>
            <Route path="/authenticated" element={<div>Authenticated Area</div>} />
        </Route>
    </Route>
);
