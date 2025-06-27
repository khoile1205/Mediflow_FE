import { BaseEntity } from "./base.entity";

export interface ServiceType extends BaseEntity {
    code: string;
    name: string;
}
