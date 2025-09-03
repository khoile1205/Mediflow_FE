import { Role } from "~/constants/roles";

export enum ResourceType {
    Inventory = "inventory",
    Management = "management",
    VaccinationReception = "vaccination-reception",
    FileStorage = "file-storage",
    Appointments = "appointments",
    HospitalService = "hospital-service",
}

export type RoutePermissionMap = {
    [path: string]: {
        requiredPermissions: ResourceType[];
        requiredRoles?: Role[];
    };
};

const inventoryRequiredRoles = [Role.HeadOfDepartment, Role.PharmacyStaff, Role.WarehouseStaff];

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

const examinationRequiredRoles = [Role.HeadOfDepartment, Role.LaboratoryStaff, Role.ImagingTechnician];
const viewExaminationRequiredRoles = [Role.HeadOfDepartment, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician];
const postVaccinationRequiredRoles = [Role.Doctor, Role.HeadOfDepartment, Role.Nurse];

const financeRequiredRoles = [Role.Accountant, Role.Receptionist, Role.Nurse];
const contractRequiredRoles = [Role.Administrator, Role.Accountant];

const createRoute = (permission: ResourceType, roles: Role[]): RoutePermissionMap[string] => ({
    requiredPermissions: [permission],
    requiredRoles: roles,
});

export const routePermissions: RoutePermissionMap = {
    // Reception
    "/reception/vaccination": createRoute(ResourceType.VaccinationReception, vaccinationReceptionRequiredRoles),

    // Vaccination
    "/vaccination": createRoute(ResourceType.VaccinationReception, vaccinationRequiredRoles),
    "/vaccination/history": createRoute(ResourceType.VaccinationReception, vaccinationHistoryRequiredRoles),
    "/vaccination/patient-history": createRoute(
        ResourceType.VaccinationReception,
        vaccinationPatientHistoryRequiredRoles,
    ),
    "/vaccination/post-injection": createRoute(ResourceType.VaccinationReception, postVaccinationRequiredRoles),

    // Appointments
    "/appointments/follow-up": createRoute(ResourceType.Appointments, appointmentsRequiredRoles),

    // Finance
    "/finance": createRoute(ResourceType.VaccinationReception, financeRequiredRoles),
    "/finance/transaction-history": createRoute(ResourceType.VaccinationReception, [
        Role.Administrator,
        Role.Receptionist,
        Role.Accountant,
    ]),

    // Examination
    "/examination/history/patient": createRoute(ResourceType.VaccinationReception, viewExaminationRequiredRoles),
    "/examination/history/patients": createRoute(ResourceType.VaccinationReception, viewExaminationRequiredRoles),
    "/examination": createRoute(ResourceType.VaccinationReception, examinationRequiredRoles),

    // Pharmacy
    "/pharmacy/import": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/pharmacy/expired-medicine": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/pharmacy/expired-return-form": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/pharmacy/limit-stock": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/pharmacy/medicine-quantity-statistics/medicines/": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/pharmacy/medicine-import-list": createRoute(ResourceType.Inventory, inventoryRequiredRoles),

    // Medicine Management
    "/medicine/medicine-list": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/medicine/create-medicine": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/medicine/create-medicine-interaction": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/medicine/medicine-interaction-list": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/medicine/medicine-price-list": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/medicine/create-medicine-price": createRoute(ResourceType.Inventory, inventoryRequiredRoles),
    "/medicine/medicine-statistics": createRoute(ResourceType.Inventory, inventoryRequiredRoles),

    // Contract Management
    "/contract/supplier": createRoute(ResourceType.Management, contractRequiredRoles),

    // Management
    "/management/users": createRoute(ResourceType.Management, managementRequiredRoles),
    "/management/departments": createRoute(ResourceType.Management, managementRequiredRoles),
    "/management/authorization": createRoute(ResourceType.Management, [
        Role.Administrator,
        Role.HeadOfDepartment,
        Role.ITSupport,
    ]),
    "/management/overview": createRoute(ResourceType.Management, managementRequiredRoles),

    "/service/hospital-service": createRoute(ResourceType.HospitalService, managementRequiredRoles),
    "/service/examination-service": createRoute(ResourceType.HospitalService, managementRequiredRoles),

    "/reports": createRoute(ResourceType.FileStorage, reportsRequiredRoles),
};
