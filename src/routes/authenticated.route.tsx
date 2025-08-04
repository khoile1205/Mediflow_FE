import { Route } from "react-router";
import HospitalFeePage from "~/pages/hospital-fee";
import LandingBackground from "~/pages/landing";
import ImportInventoryFromSupplier from "~/pages/pharmacy/import_from_supplier";
import ReceptionVaccination from "~/pages/reception/vaccination";
import VaccinationHistory from "~/pages/vaccination/vaccination-history/vaccination-history";
import VaccinationPage from "~/pages/vaccination";
import AuthenticatedGuard from "../guards/authenticated.guard";
import PostVaccinationPage from "~/pages/post-vaccination";
import { AppointmentsManagementPage } from "~/pages/appointments/follow-up";
import DepartmentManagement from "~/pages/management/departments/department-management.page";
import UserManagement from "~/pages/management/users/user-management.page";
import { ExaminationPatientHistoryPage } from "~/pages/examination/examination-history";
import ListPatientsExaminationHistoryPage from "~/pages/examination/examination-history/examination-patients.page";
import { ExaminationPage } from "~/pages/examination/examination.page";
import MedicineListPage from "~/pages/management/medicine/medicine-list.page";
import CreateMedicinePage from "~/pages/management/medicine/medicine-create.page";
import CreateMedicineInteractionPage from "~/pages/management/medicine/medicine-interaction-create.page";
import MedicineInteractionListPage from "~/pages/management/medicine/medicine-interaction-list.page";
import MedicinePriceListPage from "~/pages/management/medicine/medicine-price.page";
import CreateMedicinePricePage from "~/pages/management/medicine/medicine-price-create.page";
import InventoryLimitStockPage from "~/pages/management/inventory-stock/inventory-stock.page";
import { SupplierManagementPage } from "~/pages/supplier";
import { NearlyExpiredMedicineBatchPage } from "~/pages/pharmacy/expired-medicine";

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
            <Route path="history" element={<VaccinationHistory />} />
            <Route path="post-injection" element={<PostVaccinationPage />} />
        </Route>

        <Route path="/finance" element={<HospitalFeePage />} />

        <Route path="/pharmacy">
            <Route path="import" element={<ImportInventoryFromSupplier />} />
            <Route path="expired-medicine" element={<NearlyExpiredMedicineBatchPage />} />
        </Route>

        <Route path="/medicine">
            <Route path="medicine-list" element={<MedicineListPage />} />
            <Route path="create-medicine" element={<CreateMedicinePage />} />
            <Route path="create-medicine-interaction" element={<CreateMedicineInteractionPage />} />
            <Route path="medicine-interaction-list" element={<MedicineInteractionListPage />} />
            <Route path="medicine-price-list" element={<MedicinePriceListPage />} />
            <Route path="create-medicine-price" element={<CreateMedicinePricePage />} />
        </Route>

        <Route path="/inventory">
            <Route path="limit-stock" element={<InventoryLimitStockPage />} />
        </Route>

        <Route path="/contract">
            <Route path="supplier" element={<SupplierManagementPage />} />
        </Route>
        <Route path="/management">
            <Route path="users" element={<UserManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
        </Route>

        <Route path="/examination">
            <Route path="history/patients" element={<ListPatientsExaminationHistoryPage />} />
            <Route path="history/patient/:id" element={<ExaminationPatientHistoryPage />} />
            <Route index element={<ExaminationPage />} />
        </Route>

        <Route path="*" element={<div>Developing</div>} />
    </Route>
);
