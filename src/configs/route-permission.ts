export enum ResourceType {
    Inventory = "inventory",
    Management = "management",
    VaccinationReception = "vaccination-reception",
    FileStorage = "file-storage",
    Appointments = "appointments",
    HospitalService = "hospital-service",
}

export type RoutePermissionMap = {
    [path: string]: ResourceType[];
};

export const routePermissions: RoutePermissionMap = {
    "/reception/vaccination": [ResourceType.VaccinationReception],
    "/vaccination": [ResourceType.VaccinationReception],
    "/vaccination/history": [ResourceType.VaccinationReception],
    "/vaccination/post-injection": [ResourceType.VaccinationReception],
    "/appointments/follow-up": [ResourceType.Appointments],
    "/finance": [ResourceType.VaccinationReception],
    "/pharmacy/import": [ResourceType.Inventory],
};
