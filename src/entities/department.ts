import { BaseEntity } from "./base.entity";

export interface Department extends BaseEntity {
    code: string;
    name: string;
    nameInEnglish: string;
    departmentType: DepartmentType;
}

export interface DepartmentType {
    id: number;
    name: string;
    nameInEnglish: string;
}
