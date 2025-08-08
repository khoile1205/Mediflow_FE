import { Role } from "~/constants/roles";

export enum ResourceTypePermission {
    Read_Only = "read",
    Read_Write = "read_write",
    None = "none",
}

export type UserPermission = {
    roles: Role[];
    departments: string[];
    resourceTypes: {
        [key: string]: ResourceTypePermission;
    };
};
