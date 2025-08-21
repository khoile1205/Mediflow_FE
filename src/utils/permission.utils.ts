import { ResourceType, RoutePermissionMap } from "~/configs/route-permission";
import { sidebarTree } from "~/configs/sidebar";
import { Role } from "~/constants/roles";
import { ResourceTypePermission } from "~/entities/user-permission";

export const findPermissionsInSidebar = (
    path: string,
    items = sidebarTree,
): { requiredPermissions?: ResourceType[]; requiredRoles?: Role[] } => {
    for (const item of items) {
        if (item.pathName === path) {
            return {
                requiredPermissions: item.requiredPermissions,
                requiredRoles: item.requiredRoles,
            };
        }
        if (item.children) {
            const found = findPermissionsInSidebar(path, item.children);
            if (found.requiredPermissions || found.requiredRoles) return found;
        }
    }
    return {};
};

export const hasPermission = ({
    resourceTypes,
    requiredPermissions = [],
    userRoles = [],
    requiredRoles = [],
    accessModifier,
}: {
    resourceTypes: { [key: string]: ResourceTypePermission } | undefined;
    requiredPermissions?: string[];
    userRoles?: Role[];
    requiredRoles?: Role[];
    accessModifier?: ResourceTypePermission;
}) => {
    // If no permissions or roles are required, grant access
    if (!requiredPermissions.length && !requiredRoles.length) {
        return true;
    }

    // Check resource-based permissions (allow 'read' or 'read_write')
    const hasResourceAccess = resourceTypes
        ? requiredPermissions.every((key) => {
              const userAccess = resourceTypes[key];
              if (!userAccess || userAccess === ResourceTypePermission.None) return false;

              if (accessModifier == ResourceTypePermission.Read_Write) {
                  return userAccess === ResourceTypePermission.Read_Write;
              }

              return (
                  userAccess === ResourceTypePermission.Read_Only || userAccess === ResourceTypePermission.Read_Write
              );
          })
        : false;

    // Check role-based permissions (allow if any user role is in requiredRoles)
    const hasRoleAccess = userRoles.some((role) => requiredRoles.includes(role));

    // Grant access if either condition is met
    return hasResourceAccess && hasRoleAccess;
};

export const getRequiredPermissionForPath = (
    path: string,
    permissionMap: RoutePermissionMap,
): { requiredPermissions: string[] | undefined; requiredRoles: Role[] | undefined } => {
    if (permissionMap[path]) {
        return {
            requiredPermissions: permissionMap[path].requiredPermissions,
            requiredRoles: permissionMap[path].requiredRoles,
        };
    }

    const entry = Object.entries(permissionMap).find(([prefix]) => path.startsWith(prefix));
    return {
        requiredPermissions: entry?.[1].requiredPermissions,
        requiredRoles: entry?.[1].requiredRoles,
    };
};
