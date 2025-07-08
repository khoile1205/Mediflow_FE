export type RoutePermissionMap = {
    [path: string]: string[];
};

export const routePermissions: RoutePermissionMap = {
    "/reception/vaccination": ["vaccination-reception"],
    "/vaccination": ["appointments"],
    "/vaccination/history": ["appointments"],
    "/vaccination/post-injection": ["appointments"],
    "/finance": ["hospital-service"],
    "/pharmacy/import": ["inventory"],
};
