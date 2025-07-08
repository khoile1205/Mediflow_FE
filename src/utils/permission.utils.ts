export const hasPermission = (resourceTypes: Record<string, string> | undefined, required: string[] = []): boolean => {
    if (!resourceTypes) return false;
    return required.every((key) => key in resourceTypes);
};

export const getRequiredPermissionForPath = (
    path: string,
    permissionMap: Record<string, string[]>,
): string[] | undefined => {
    return Object.entries(permissionMap).find(([prefix]) => path.startsWith(prefix))?.[1];
};
