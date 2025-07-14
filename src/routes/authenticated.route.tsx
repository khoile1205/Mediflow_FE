import { Route } from "react-router";
import HospitalFeePage from "~/pages/hospital-fee";
import LandingBackground from "~/pages/landing";
import ImportInventoryFromSupplier from "~/pages/pharmacy/import_from_supplier";
import ReceptionVaccination from "~/pages/reception/vaccination";
import PatientVaccinationHistory from "~/pages/vaccination/patient-vacciation-history/patient-vacciation-history";
import VaccinationPage from "~/pages/vaccination";
import AuthenticatedGuard from "../guards/authenticated.guard";
import PostVaccinationPage from "~/pages/post-vaccination";
import DepartmentPage from "~/pages/management/departments/department-management.page";
import { AppointmentsManagementPage } from "~/pages/appointments/follow-up";

export const AuthenticatedRoutes = (
    <Route element={<AuthenticatedGuard />}>
        <Route path="/" element={<LandingBackground />} />
        <Route path="/authenticated" element={<div>Authenticated Area</div>} />

        <Route path="/reception">
            <Route path="vaccination" element={<ReceptionVaccination />} />
        </Route>
        <Route path="/appointments">
            <Route path="follow-up" element={<AppointmentsManagementPage />} />
        </Route>
        <Route path="/vaccination">
            <Route index element={<VaccinationPage />} />
            <Route path="history" element={<PatientVaccinationHistory />} />
            <Route path="post-injection" element={<PostVaccinationPage />} />
        </Route>

        <Route path="/finance" element={<HospitalFeePage />} />
        <Route path="/pharmacy">
            <Route path="import" element={<ImportInventoryFromSupplier />} />
        </Route>

        <Route path="/management">
            <Route path="users" element={<div>Staff Management</div>} />
            <Route path="authorization" element={<div>Authorization Management</div>} />
            <Route path="departments" element={<DepartmentPage />} />
        </Route>

        <Route path="*" element={<div>Developing</div>} />
    </Route>
);
