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

export const routePermissions: RoutePermissionMap = {
    "/reception/vaccination": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [
            Role.Administrator,
            Role.Doctor,
            Role.Nurse,
            Role.Receptionist,
            Role.LaboratoryStaff,
            Role.ImagingTechnician,
            Role.Accountant,
        ],
    },
    "/vaccination": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [
            Role.Administrator,
            Role.Doctor,
            Role.Nurse,
            Role.Receptionist,
            Role.LaboratoryStaff,
            Role.ImagingTechnician,
        ],
    },
    "/vaccination/history": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [
            Role.Administrator,
            Role.Doctor,
            Role.Nurse,
            Role.Receptionist,
            Role.LaboratoryStaff,
            Role.ImagingTechnician,
        ],
    },
    "/vaccination/post-injection": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [
            Role.Administrator,
            Role.Doctor,
            Role.Nurse,
            Role.Receptionist,
            Role.LaboratoryStaff,
            Role.ImagingTechnician,
        ],
    },
    "/appointments/follow-up": {
        requiredPermissions: [ResourceType.Appointments],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.Receptionist],
    },
    "/finance": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Accountant],
    },
    "/examination/list-patients": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician],
    },
    "/examination": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician],
    },
    "/examination/history/patients": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician],
    },
    "/pharmacy/import": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    "/management/users": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    },
    "/management/authorization": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    },
    "/management/departments": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    },
};
