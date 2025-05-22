import { Route } from "react-router";
import AuthenticatedGuard from "../guards/authenticated.guard";

export const AuthenticatedRoutes = (
    <Route element={<AuthenticatedGuard />}>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/authenticated" element={<div>Authenticated Area</div>} />
    </Route>
);
