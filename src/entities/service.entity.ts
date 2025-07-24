import { BaseEntity } from "./base.entity";

// export interface Service extends BaseEntity {
//     serviceCode: string;
//     serviceName: string;
//     unitPrice: number;
//     departmentId: number;
// }

export interface Service extends BaseEntity {
    serviceCode: string;
    serviceName: string;
    unitPrice: number;
    departmentId: number;
    examinationService?: number;
    serviceTestParameters?: ServiceTestParameter[];
}

export interface ServiceTestParameter extends BaseEntity {
    serviceId: number;
    parameterName: string;
    unit: string;
    standardValue: string;
    equipmentName: string;
    specimenType: string;
}
