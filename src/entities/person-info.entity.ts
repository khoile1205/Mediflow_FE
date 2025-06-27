import { Gender } from "~/constants/enums";
import { BaseEntity } from "./base.entity";
import { Department } from "./department";
import { Role } from "~/constants/roles";

export interface PersonInfo extends BaseEntity {
    code: string;
    name: string;
    phoneNumber: string;
    address: string;
    gender?: Gender;
    email?: string;
}

export interface Staff extends PersonInfo {
    userName: string;
    email: string;
    profilePictureUrl: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    departments: Department[];
    roles: Role[];
}

export interface Patient extends PersonInfo {
    dob: Date;
    identityCard: string;
    addressDetail: string;
    province: string;
    district: string;
    ward: string;
    isPregnant: boolean;
    isForeigner: boolean;
}
