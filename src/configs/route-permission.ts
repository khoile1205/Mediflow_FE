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
    // Reception
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

    // Vaccination
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

    // Appointments
    "/appointments/follow-up": {
        requiredPermissions: [ResourceType.Appointments],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.Receptionist],
    },

    // Finance
    "/finance": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Accountant],
    },

    // Examination
    "/examination": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician],
    },
    "/examination/history/patients": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician],
    },
    "/examination/history/patient/:id": {
        requiredPermissions: [ResourceType.VaccinationReception],
        requiredRoles: [Role.Administrator, Role.Doctor, Role.LaboratoryStaff, Role.ImagingTechnician],
    },

    // Pharmacy
    "/pharmacy/import": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    "/pharmacy/expired-medicine": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    "/pharmacy/expired-return-form": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },

    // Medicine Management
    "/medicine/medicine-list": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    "/medicine/create-medicine": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    "/medicine/create-medicine-interaction": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    "/medicine/medicine-interaction-list": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    "/medicine/medicine-price-list": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },
    "/medicine/create-medicine-price": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },

    // Inventory Management
    "/inventory/limit-stock": {
        requiredPermissions: [ResourceType.Inventory],
        requiredRoles: [Role.Administrator, Role.PharmacyStaff, Role.WarehouseStaff],
    },

    // Contract Management
    "/contract/supplier": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.Accountant],
    },

    // Management
    "/management/users": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    },
    "/management/departments": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    },
    "/management/authorization": {
        requiredPermissions: [ResourceType.Management],
        requiredRoles: [Role.Administrator, Role.HeadOfDepartment, Role.ITSupport],
    },
};
