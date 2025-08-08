import { BaseEntity } from "./base.entity";

export interface Service extends BaseEntity {
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: number;
}
