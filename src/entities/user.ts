import { BaseEntity } from "./base.entity";
import { Department } from "./department";

export interface User extends BaseEntity {
    code: string;
    name: string;
    userName: string;
    email: string;
    emailConfirmed?: boolean;
    phoneNumber: string;
    phoneNumberConfirmed?: boolean;
    twoFactorEnabled?: boolean;
    address: string;
    profilePictureUrl: string;
    departments: Department[];
    roles: string[];
    isSuspended: boolean;
    isCancelled?: boolean;
}
