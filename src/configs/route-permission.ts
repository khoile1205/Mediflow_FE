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
const vaccinationRequiredRoles = [Role.Doctor, Role.HeadOfDepartment, Role.Nurse];
const appointmentsRequiredRoles = [Role.HeadOfDepartment, Role.Doctor, Role.Receptionist];
const examinationRequiredRoles = [Role.HeadOfDepartment, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician];
const financeRequiredRoles = [Role.Accountant, Role.Receptionist, Role.Nurse];
const contractRequiredRoles = [Role.Administrator, Role.Accountant];

export const routePermissions: RoutePermissionMap = {
    // Reception
    "/reception/vaccination": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: vaccinationReceptionRequiredRoles,
    },

    // Vaccination
    "/vaccination": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: vaccinationRequiredRoles,
    },
    "/vaccination/history": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: vaccinationRequiredRoles,
    },
    "/vaccination/post-injection": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: vaccinationRequiredRoles,
    },

    // Appointments
    "/appointments/follow-up": {
        requiredPermissions: [ResourceType.Appointments],
        requiredRoles: appointmentsRequiredRoles,
    },

    // Finance
    "/finance": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: financeRequiredRoles,
    },

    // Examination
    "/examination": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: examinationRequiredRoles,
    },
    "/examination/history/patients": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: examinationRequiredRoles,
    },
    "/examination/history/patient/:id": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: examinationRequiredRoles,
    },

    // Pharmacy
    "/pharmacy/import": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },
    "/pharmacy/expired-medicine": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },
    "/pharmacy/expired-return-form": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },

    // Medicine Management
    "/medicine/medicine-list": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },
    "/medicine/create-medicine": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },
    "/medicine/create-medicine-interaction": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },
    "/medicine/medicine-interaction-list": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },
    "/medicine/medicine-price-list": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },
    "/medicine/create-medicine-price": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },

    // Inventory Management
    "/inventory/limit-stock": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: inventoryRequiredRoles,
    },

    // Contract Management
    "/contract/supplier": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: contractRequiredRoles,
    },

    // Management
    "/management/users": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: managementRequiredRoles,
    },
    "/management/departments": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: managementRequiredRoles,
    },
    "/management/authorization": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    },
};
