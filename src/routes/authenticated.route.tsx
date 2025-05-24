import { Route } from "react-router";
import AuthenticatedGuard from "../guards/authenticated.guard";
import LandingBackground from "~/pages/landing";

export const AuthenticatedRoutes = (
    <Route element={<AuthenticatedGuard />}>
        <Route path="/" element={<LandingBackground />} />
        <Route path="/authenticated" element={<div>Authenticated Area</div>} />
        <Route path="*" element={<div>Developing</div>} />
    </Route>
);
