import { Route } from "react-router";
import AuthenticatedGuard from "../guards/authenticated.guard";
import LandingBackground from "~/pages/landing";
import ReceptionVaccination from "~/pages/reception/vaccination";
import HospitalFeePage from "~/pages/hospital-fee";
import ImportInventoryFromSupplier from "~/pages/pharmacy/import_from_supplier";

export const AuthenticatedRoutes = (
    <Route element={<AuthenticatedGuard />}>
        <Route path="/" element={<LandingBackground />} />
        <Route path="/authenticated" element={<div>Authenticated Area</div>} />
        <Route path="/reception">
            <Route path="vaccination" element={<ReceptionVaccination />} />
        </Route>
        <Route path="/finance" element={<HospitalFeePage />} />
        <Route path="/pharmacy">
            <Route path="import" element={<ImportInventoryFromSupplier />} />
        </Route>
        <Route path="*" element={<div>Developing</div>} />
    </Route>
);
