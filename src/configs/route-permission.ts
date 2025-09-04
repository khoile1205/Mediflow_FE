import { Role } from "~/constants/roles";
import { Department } from "~/entities";

export enum ResourceType {
    Inventory = "inventory",
    Management = "management",
    VaccinationReception = "vaccination-reception",
    FileStorage = "file-storage",
    Appointments = "appointments",
    HospitalService = "hospital-service",
    Examination = "examination",
}

export type RoutePermissionMap = {
    [path: string]: {
        requiredPermissions: ResourceType[];
        requiredRoles?: Role[];
        requiredDepartments?: Department[];
    };
};

const inventoryRequiredRoles = [Role.HeadOfDepartment, Role.WarehouseStaff];

const pharmacyRequiredRoles = [Role.HeadOfDepartment, Role.PharmacyStaff];

const managementRequiredRoles = [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport];

const vaccinationReceptionRequiredRoles = [Role.HeadOfDepartment, Role.Doctor, Role.Nurse, Role.Receptionist];
const vaccinationRequiredRoles = [Role.Doctor, Role.HeadOfDepartment];
const vaccinationHistoryRequiredRoles = [
    Role.Doctor,
    Role.ImagingTechnician,
    Role.LaboratoryStaff,
    Role.HeadOfDepartment,
    Role.Nurse,
];
const vaccinationPatientHistoryRequiredRoles = [
    Role.Doctor,
    Role.HeadOfDepartment,
    Role.Nurse,
    Role.ImagingTechnician,
    Role.LaboratoryStaff,
];

const reportsRequiredRoles = [Role.Administrator, Role.HeadOfDepartment, Role.Accountant];

const appointmentsRequiredRoles = [Role.HeadOfDepartment, Role.Doctor];

const examinationRequiredRoles = [Role.HeadOfDepartment, Role.Doctor, Role.LaboratoryStaff];
const viewExaminationRequiredRoles = [Role.HeadOfDepartment, Role.Doctor, Role.LaboratoryStaff];

const postVaccinationRequiredRoles = [Role.Doctor, Role.HeadOfDepartment, Role.Nurse];

const financeRequiredRoles = [Role.Accountant, Role.Receptionist, Role.Nurse];
const contractRequiredRoles = [Role.Administrator, Role.Accountant];

const createRoute = (
    permission: ResourceType[],
    roles: Role[],
    departments?: Department[],
): RoutePermissionMap[string] => ({
    requiredPermissions: permission,
    requiredRoles: roles,
    requiredDepartments: departments ?? [],
});

export const routePermissions: RoutePermissionMap = {
    // Reception
    "/reception/vaccination": createRoute([ResourceType.VaccinationReception], vaccinationReceptionRequiredRoles),

    // Vaccination
    "/vaccination/history": createRoute([ResourceType.VaccinationReception], vaccinationHistoryRequiredRoles),
    "/vaccination/patient-history": createRoute(
        [ResourceType.VaccinationReception],
        vaccinationPatientHistoryRequiredRoles,
    ),
    "/vaccination/post-injection": createRoute([ResourceType.VaccinationReception], postVaccinationRequiredRoles),
    "/vaccination": createRoute([ResourceType.VaccinationReception], vaccinationRequiredRoles),

    // Appointments
    "/appointments/follow-up": createRoute([ResourceType.Appointments], appointmentsRequiredRoles),

    // Finance
    "/finance/transaction-history": createRoute(
        [ResourceType.VaccinationReception],
        [Role.Administrator, Role.Receptionist, Role.Accountant],
    ),
    "/finance": createRoute([ResourceType.VaccinationReception], financeRequiredRoles),

    // Examination
    "/examination/history/patient": createRoute(
        [ResourceType.Examination, ResourceType.VaccinationReception],
        viewExaminationRequiredRoles,
    ),
    "/examination/history/patients": createRoute(
        [ResourceType.Examination, ResourceType.VaccinationReception],
        viewExaminationRequiredRoles,
    ),
    "/examination": createRoute([ResourceType.Examination], examinationRequiredRoles),

    // Pharmacy
    "/pharmacy/import": createRoute([ResourceType.Inventory], inventoryRequiredRoles),
    "/pharmacy/expired-medicine": createRoute([ResourceType.Inventory], inventoryRequiredRoles),
    "/pharmacy/expired-return-form": createRoute([ResourceType.Inventory], inventoryRequiredRoles),
    "/pharmacy/limit-stock": createRoute([ResourceType.Inventory], inventoryRequiredRoles),
    "/pharmacy/medicine-quantity-statistics/medicines/": createRoute([ResourceType.Inventory], inventoryRequiredRoles),
    "/pharmacy/medicine-import-list": createRoute([ResourceType.Inventory], inventoryRequiredRoles),

    // Medicine Management
    "/medicine/medicine-list": createRoute([ResourceType.Inventory], pharmacyRequiredRoles),
    "/medicine/create-medicine": createRoute([ResourceType.Inventory], pharmacyRequiredRoles),
    "/medicine/create-medicine-interaction": createRoute([ResourceType.Inventory], pharmacyRequiredRoles),
    "/medicine/medicine-interaction-list": createRoute([ResourceType.Inventory], pharmacyRequiredRoles),
    "/medicine/medicine-price-list": createRoute([ResourceType.Inventory], pharmacyRequiredRoles),
    "/medicine/create-medicine-price": createRoute([ResourceType.Inventory], pharmacyRequiredRoles),
    "/medicine/medicine-statistics": createRoute([ResourceType.Inventory], pharmacyRequiredRoles),

    // Contract Management
    "/contract/supplier": createRoute([ResourceType.Management], contractRequiredRoles),

    // Management
    "/management/users": createRoute([ResourceType.Management], managementRequiredRoles),
    "/management/departments": createRoute([ResourceType.Management], managementRequiredRoles),
    "/management/authorization": createRoute(
        [ResourceType.Management],
        [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    ),
    "/management/overview": createRoute([ResourceType.Management], managementRequiredRoles),

    "/service/hospital-service": createRoute([ResourceType.HospitalService], managementRequiredRoles),
    "/service/examination-service": createRoute([ResourceType.HospitalService], managementRequiredRoles),

    "/reports": createRoute([ResourceType.FileStorage], reportsRequiredRoles),
};
