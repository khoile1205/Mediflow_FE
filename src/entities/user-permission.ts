export type UserPermission = {
    roles: string[];
    departments: string[];
    resourceTypes: {
        [key: string]: "read_write" | "read" | "none";
    };
};
